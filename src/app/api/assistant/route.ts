import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

const assistantSchema = z.object({
  message: z.string().min(1).max(600),
  language: z.enum(['en', 'hi', 'kn']).default('en'),
  website: z.string().optional(),
});

const LANGUAGE_LABELS: Record<'en' | 'hi' | 'kn', string> = {
  en: 'English',
  hi: 'Hindi',
  kn: 'Kannada',
};

function buildSystemPrompt(language: 'en' | 'hi' | 'kn', contextSummary: string): string {
  return [
    'You are Nova AI, the railway travel assistant for RailNova (a demonstration Indian railway booking platform).',
    `Reply concisely in ${LANGUAGE_LABELS[language]} (2-4 sentences).`,
    'Never invent train numbers, fares, or PNR records outside the provided catalog context; remind users to verify live availability on the search results page when relevant.',
    contextSummary ? `Relevant catalog context:\n${contextSummary}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

async function queryOpenRouter(systemPrompt: string, userMessage: string): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'RailNova Nova AI',
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 300,
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch {
    return null;
  }
}

async function queryGemini(systemPrompt: string, userMessage: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
        'Api-Revision': '2026-05-20',
      },
      body: JSON.stringify({
        model: 'gemini-4-hydrogen',
        system_instruction: systemPrompt,
        input: userMessage,
        store: false,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      output_text?: string;
      steps?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
    };
    if (data.output_text?.trim()) return data.output_text.trim();
    const parts = (data.steps || [])
      .filter((s) => s.type === 'model_output')
      .flatMap((s) => s.content || [])
      .map((c) => c.text?.trim())
      .filter((t): t is string => Boolean(t));
    return parts.length > 0 ? parts.join('\n') : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  const rl = checkRateLimit(`assistant:${ip}`, 20, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many assistant requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = assistantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });
    }
    if (parsed.data.website && parsed.data.website.trim().length > 0) {
      return NextResponse.json({ error: 'Spam check failed.' }, { status: 400 });
    }

    const query = parsed.data.message.toLowerCase();
    const db = await getDb();

    // Match stations mentioned in user prompt
    const matchedStations = db.stations.filter(
      (s) =>
        query.includes(s.city.toLowerCase()) ||
        query.includes(s.code.toLowerCase())
    );

    let fallbackReply =
      'I can help you find routes (e.g. "Bengaluru to Goa"), compare travel classes (1A, 2A, 3A, CC, EC), or explain RAC & Waitlist rules. Note: AI suggestions are guidance only—always verify live availability on the search results page.';
    let suggestions = [
      { label: 'Bengaluru → Goa Trains', href: '/trains?from=SBC&to=MAO' },
      { label: 'Mumbai → Delhi Rajdhani', href: '/trains?from=CSMT&to=NDLS' },
      { label: 'Check Demo PNR', href: '/pnr' },
    ];
    let contextSummary = '';

    if (query.includes('rac') || query.includes('waitlist') || query.includes('wl')) {
      fallbackReply =
        'RAC (Reservation Against Cancellation) guarantees boarding and a shared sitting berth, upgrading automatically to a full berth if confirmed passengers cancel. Waitlist (WL) passengers cannot board reserved coaches unless the ticket upgrades to RAC or CNF before chart preparation (typically 4 hours before departure).';
      suggestions = [
        { label: 'Check PNR Status', href: '/pnr' },
        { label: 'Search Available Trains', href: '/trains' },
      ];
    } else if (
      query.includes('class') ||
      query.includes('1a') ||
      query.includes('2a') ||
      query.includes('3a') ||
      query.includes('vande')
    ) {
      fallbackReply =
        'Class guide: Executive Chair Car (EC) & First AC (1A) offer maximum legroom and privacy. Second AC (2A) uses 2-tier bays with curtains—ideal for overnight comfort. Third AC (3A) & 3E balance AC comfort and value. Chair Car (CC) fits daytime Vande Bharat & Shatabdi routes.';
      suggestions = [
        { label: 'Compare Bengaluru → Mysuru Vande Bharat', href: '/trains?from=SBC&to=MYS' },
        { label: 'Explore Sleeper & AC Routes', href: '/trains' },
      ];
    } else if (matchedStations.length >= 2) {
      const from = matchedStations[0];
      const to = matchedStations[1];
      const matchingTrains = db.trains.filter(
        (t) =>
          (t.fromCode === from.code && t.toCode === to.code) ||
          (t.stops.some((s) => s.stationCode === from.code) &&
            t.stops.some((s) => s.stationCode === to.code))
      );

      if (matchingTrains.length > 0) {
        const top = matchingTrains[0];
        const minFare = Math.min(...top.classes.map((c) => c.fare));
        contextSummary = matchingTrains
          .slice(0, 5)
          .map(
            (t) =>
              `${t.number} ${t.name} (${t.fromCode}→${t.toCode}, dep ${t.departureTime}, ${t.durationLabel}, from ₹${Math.min(...t.classes.map((c) => c.fare))})`
          )
          .join('\n');
        fallbackReply = `I found ${matchingTrains.length} demonstration train(s) from ${from.city} (${from.code}) to ${to.city} (${to.code}). Top pick: ${top.number} ${top.name} departing at ${top.departureTime} (${top.durationLabel}), starting around ₹${minFare}.`;
        suggestions = [
          {
            label: `View ${from.code} → ${to.code} Trains`,
            href: `/trains?from=${from.code}&to=${to.code}`,
          },
        ];
      }
    } else if (matchedStations.length === 1) {
      const dest = matchedStations[0];
      const related = db.trains.filter(
        (t) => t.toCode === dest.code || t.fromCode === dest.code
      );
      contextSummary = related
        .slice(0, 5)
        .map((t) => `${t.number} ${t.name} (${t.fromCode}→${t.toCode}, dep ${t.departureTime})`)
        .join('\n');
      fallbackReply = `${dest.city} (${dest.code}) has ${related.length} featured demonstration corridors in RailNova. For an affordable overnight journey, look at Sleeper (SL) or AC 3 Economy (3E) options, or choose Vande Bharat / Rajdhani for speed.`;
      suggestions = [
        { label: `Search Trains to ${dest.city}`, href: `/trains?to=${dest.code}` },
        { label: 'Explore Destinations', href: '/discover' },
      ];
    }

    const systemPrompt = buildSystemPrompt(parsed.data.language, contextSummary);
    const llmReply =
      (await queryOpenRouter(systemPrompt, parsed.data.message)) ||
      (await queryGemini(systemPrompt, parsed.data.message));

    return NextResponse.json({
      isAiRecommendation: true,
      reply: llmReply || fallbackReply,
      suggestions,
    });
  } catch {
    return NextResponse.json({ error: 'Nova AI could not process that request.' }, { status: 500 });
  }
}
