'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Send, Sparkles } from 'lucide-react';

interface DemoMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggestions?: { label: string; href: string }[];
}

interface PresetScenario {
  prompt: string;
  reply: string;
  suggestions: { label: string; href: string }[];
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    prompt: 'Fastest train from Bengaluru to Mysuru?',
    reply:
      '20607 Chennai–Mysuru Vande Bharat departs KSR Bengaluru (SBC) at 10:25 and reaches Mysuru (MYS) in 2 hours, with AC Chair Car (₹1,200) and Executive Chair Car (₹2,295).',
    suggestions: [
      { label: 'View SBC → MYS Trains', href: '/trains?from=SBC&to=MYS' },
      { label: 'Track 20607 Live', href: '/live-tracking' },
    ],
  },
  {
    prompt: 'Explain RAC vs Waitlist tickets',
    reply:
      'RAC (Reservation Against Cancellation) lets you board the train with a shared Side-Lower seat until a confirmed berth opens. Waitlist (WL) tickets cannot board if they remain unconfirmed after chart preparation.',
    suggestions: [{ label: 'Check Demo PNR 8429104521', href: '/pnr?pnr=8429104521' }],
  },
  {
    prompt: 'Best overnight train from Bengaluru to Goa?',
    reply:
      '17309 Yesvantpur–Vasco-da-Gama Express departs SBC at 14:30 and arrives in Madgaon (MAO) at 05:10 (14h 40m), offering 2A (₹1,520), 3A (₹1,065), 3E (₹960), and Sleeper (₹395).',
    suggestions: [{ label: 'Book SBC → MAO', href: '/trains?from=SBC&to=MAO' }],
  },
];

export function NovaAIDemoSection() {
  const prefersReduced = useReducedMotion();
  const [language, setLanguage] = useState<'en' | 'hi' | 'kn'>('en');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<DemoMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: 'Welcome to Nova AI. Ask me about Indian railway routes, Vande Bharat timings, or RAC/Waitlist rules — or test a prompt below.',
      suggestions: [{ label: 'Search Bengaluru → Goa', href: '/trains?from=SBC&to=MAO' }],
    },
  ]);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    const el = transcriptRef.current;
    if (!el || !shouldAutoScrollRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const handleTranscriptScroll = () => {
    const el = transcriptRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom <= 24;
  };

  const runPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) return;

    const userMsg: DemoMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };
    setMessages((prev) => [...prev.slice(-4), userMsg]);
    setInput('');

    const preset = PRESET_SCENARIOS.find(
      (s) => s.prompt.toLowerCase() === trimmed.toLowerCase()
    );
    if (preset && language === 'en') {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: preset.reply,
          suggestions: preset.suggestions,
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, language }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text:
            data.reply ||
            'Verify live train schedules and fares on the Search page for your selected corridor.',
          suggestions: data.suggestions || [{ label: 'Search Trains', href: '/trains' }],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: 'Nova AI preview is in offline fallback mode. Open Search Trains to inspect all corridors and live availability.',
          suggestions: [{ label: 'Search Trains', href: '/trains' }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="nova-ai-demo-heading"
      className="py-20 lg:py-28 bg-(--bg-primary) border-b border-(--border-subtle)"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Editorial Left Copy */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Nova AI · Interactive Chat Demonstration</span>
            </span>
            <h2
              id="nova-ai-demo-heading"
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.06]"
            >
              A rail concierge that knows every corridor.
            </h2>
            <p className="text-sm sm:text-base text-(--text-secondary) leading-relaxed">
              Test Nova AI right here. Compare travel classes, decode RAC/Waitlist rules, or jump straight to a corridor search in English, Hindi, or Kannada.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-mono-tech uppercase tracking-wider text-(--text-secondary)">
              Try a live demonstration prompt
            </div>
            <div className="flex flex-col gap-2">
              {PRESET_SCENARIOS.map((item) => (
                <button
                  key={item.prompt}
                  type="button"
                  onClick={() => runPrompt(item.prompt)}
                  className="text-left rounded-xl border border-(--border-subtle) bg-(--bg-surface) px-4 py-3 text-sm font-medium text-(--text-primary) hover:border-(--accent-primary) transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{item.prompt}</span>
                  <ArrowUpRight className="h-4 w-4 text-(--accent-primary) shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Chat Demonstration Window */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-[#2A2D35] bg-[#0C0D10] text-[#F8F9FC] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A2D35] bg-[#17191F]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4FF3F] text-[#0C0D10]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-display text-sm font-bold">Nova AI Concierge</div>
                  <div className="text-[11px] font-mono-tech text-[#9296A3]">
                    Catalog-grounded guidance · Interactive Demo
                  </div>
                </div>
              </div>

                <div className="flex items-center gap-1.5" role="group" aria-label="Nova AI language">
                  {(['en', 'hi', 'kn'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      aria-pressed={language === lang}
                      onClick={() => setLanguage(lang)}
                      className={`rounded px-2 py-1 text-[11px] font-mono-tech uppercase border cursor-pointer ${language === lang
                        ? 'bg-[#D4FF3F] text-[#0C0D10] border-[#D4FF3F] font-bold'
                        : 'border-[#2A2D35] text-[#9296A3] hover:text-[#F8F9FC]'
                        }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transcript */}
                <div
                  ref={transcriptRef}
                  onScroll={handleTranscriptScroll}
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions text"
                  aria-label="Nova AI conversation transcript"
                  className="p-5 space-y-4 min-h-72.5 max-h-90 overflow-y-auto"
                >
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                      className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user'
                          ? 'bg-[#D4FF3F] text-[#0C0D10] font-medium'
                          : 'bg-[#17191F] border border-[#2A2D35] text-[#F8F9FC]'
                          }`}
                      >
                        {m.text}
                      </div>
                      {m.suggestions && m.suggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.suggestions.map((s) => (
                            <Link
                              key={s.label}
                              href={s.href}
                              className="inline-flex items-center gap-1 rounded-md border border-[#D4FF3F]/40 bg-[#D4FF3F]/10 px-2.5 py-1 text-xs font-mono-tech text-[#D4FF3F] hover:bg-[#D4FF3F] hover:text-[#0C0D10] transition-colors"
                            >
                              <span>{s.label}</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="text-xs font-mono-tech text-[#9296A3] animate-pulse">
                      Nova AI is checking RailNova corridors...
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    runPrompt(input);
                  }}
                  className="border-t border-[#2A2D35] bg-[#17191F] p-3 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Nova AI about trains, fares, or quotas..."
                    aria-label="Ask Nova AI"
                    style={{ color: '#F8F9FC' }}
                    className="flex-1 rounded-lg border border-[#2A2D35] bg-[#0C0D10] px-3.5 py-2.5 text-sm placeholder:text-[#626672] focus:outline-none focus:ring-1 focus:ring-[#D4FF3F]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label="Send message to Nova AI"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4FF3F] text-[#0C0D10] disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
        );
}
