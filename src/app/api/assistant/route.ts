import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';

const assistantSchema = z.object({
  message: z.string().min(1).max(600),
  language: z.enum(['en', 'hi', 'kn']).default('en'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = assistantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });
    }

    const query = parsed.data.message.toLowerCase();
    const db = await getDb();

    // Match stations mentioned in user prompt
    const matchedStations = db.stations.filter(
      (s) =>
        query.includes(s.city.toLowerCase()) ||
        query.includes(s.code.toLowerCase())
    );

    if (query.includes('rac') || query.includes('waitlist') || query.includes('wl')) {
      return NextResponse.json({
        isAiRecommendation: true,
        reply:
          'RAC (Reservation Against Cancellation) guarantees boarding and a shared sitting berth, upgrading automatically to a full berth if confirmed passengers cancel. Waitlist (WL) passengers cannot board reserved coaches unless the ticket upgrades to RAC or CNF before chart preparation (typically 4 hours before departure).',
        suggestions: [
          { label: 'Check PNR Status', href: '/pnr' },
          { label: 'Search Available Trains', href: '/trains' },
        ],
      });
    }

    if (query.includes('class') || query.includes('1a') || query.includes('2a') || query.includes('3a') || query.includes('vande')) {
      return NextResponse.json({
        isAiRecommendation: true,
        reply:
          'Class guide: Executive Chair Car (EC) & First AC (1A) offer maximum legroom and privacy. Second AC (2A) uses 2-tier bays with curtains—ideal for overnight comfort. Third AC (3A) & 3E balance AC comfort and value. Chair Car (CC) fits daytime Vande Bharat & Shatabdi routes.',
        suggestions: [
          { label: 'Compare Bengaluru → Mysuru Vande Bharat', href: '/trains?from=SBC&to=MYS' },
          { label: 'Explore Sleeper & AC Routes', href: '/trains' },
        ],
      });
    }

    if (matchedStations.length >= 2) {
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
        return NextResponse.json({
          isAiRecommendation: true,
          reply: `I found ${matchingTrains.length} demonstration train(s) from ${from.city} (${from.code}) to ${to.city} (${to.code}). Top pick: ${top.number} ${top.name} departing at ${top.departureTime} (${top.durationLabel}), starting around ₹${minFare}.`,
          suggestions: [
            {
              label: `View ${from.code} → ${to.code} Trains`,
              href: `/trains?from=${from.code}&to=${to.code}`,
            },
          ],
        });
      }
    }

    if (matchedStations.length === 1) {
      const dest = matchedStations[0];
      const related = db.trains.filter(
        (t) => t.toCode === dest.code || t.fromCode === dest.code
      );
      return NextResponse.json({
        isAiRecommendation: true,
        reply: `${dest.city} (${dest.code}) has ${related.length} featured demonstration corridors in RailNova. For an affordable overnight journey, look at Sleeper (SL) or AC 3 Economy (3E) options, or choose Vande Bharat / Rajdhani for speed.`,
        suggestions: [
          { label: `Search Trains to ${dest.city}`, href: `/trains?to=${dest.code}` },
          { label: 'Explore Destinations', href: '/discover' },
        ],
      });
    }

    return NextResponse.json({
      isAiRecommendation: true,
      reply:
        'I can help you find routes (e.g. "Bengaluru to Goa"), compare travel classes (1A, 2A, 3A, CC, EC), or explain RAC & Waitlist rules. Note: AI suggestions are guidance only—always verify live availability on the search results page.',
      suggestions: [
        { label: 'Bengaluru → Goa Trains', href: '/trains?from=SBC&to=MAO' },
        { label: 'Mumbai → Delhi Rajdhani', href: '/trains?from=CSMT&to=NDLS' },
        { label: 'Check Demo PNR', href: '/pnr' },
      ],
    });
  } catch {
    return NextResponse.json({ error: 'Nova AI could not process that request.' }, { status: 500 });
  }
}
