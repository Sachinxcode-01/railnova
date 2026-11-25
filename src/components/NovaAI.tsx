'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, Send, Mic, ArrowUpRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggestions?: { label: string; href: string }[];
  isAiRecommendation?: boolean;
}

const QUICK_PROMPTS = [
  'Find trains from Bengaluru to Goa',
  'Explain RAC and waiting-list tickets',
  'Help me choose the best travel class',
  'Find an affordable journey to Mumbai',
];

export function NovaAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi' | 'kn'>('en');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      isAiRecommendation: true,
      text: 'Hello, I am Nova AI. Ask me to find routes, compare travel classes, or explain RAC and waitlist rules.',
      suggestions: [
        { label: 'Bengaluru → Goa Trains', href: '/trains?from=SBC&to=MAO' },
        { label: 'Check Demo PNR', href: '/pnr' },
      ],
    },
  ]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { id: `u_${Date.now()}`, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
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
          id: `a_${Date.now()}`,
          role: 'assistant',
          text: data.reply || data.error || 'Unable to respond right now.',
          suggestions: data.suggestions,
          isAiRecommendation: true,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `e_${Date.now()}`, role: 'assistant', text: 'Network error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoice = () => {
    const win = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        onresult: (e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        onresult: (e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void;
        start: () => void;
      };
    };
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';
    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript;
      if (transcript) setInput(transcript);
    };
    rec.start();
  };

  return (
    <div className="fixed bottom-20 md:bottom-5 right-4 sm:right-5 z-50 no-print">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[400px] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
            role="dialog"
            aria-label="Nova AI Travel Assistant"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent-primary)] text-[var(--accent-on-primary)]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-display text-sm font-semibold">Nova AI</div>
                  <div className="text-[10px] font-mono-tech text-[var(--text-secondary)]">
                    AI Guidance · Verify fares on Search
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Assistant language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'kn')}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-1.5 py-1 text-xs text-[var(--text-primary)]"
                >
                  <option value="en">EN</option>
                  <option value="hi">HI</option>
                  <option value="kn">KN</option>
                </select>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close Nova AI"
                  className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)] font-medium'
                        : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)]'
                    }`}
                  >
                    {m.isAiRecommendation && (
                      <span className="block mb-1 text-[10px] font-mono-tech uppercase tracking-wider text-[var(--accent-lavender)]">
                        AI Recommendation
                      </span>
                    )}
                    {m.text}
                  </div>
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.suggestions.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="inline-flex items-center gap-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 text-xs font-medium text-[var(--accent-primary)] hover:border-[var(--accent-primary)]"
                        >
                          <span>{s.label}</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-mono-tech">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                  <span>Nova AI is thinking...</span>
                </div>
              )}
            </div>

            <div className="px-3 py-2 border-t border-[var(--border-subtle)] flex gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="shrink-0 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2 p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about routes, classes, RAC..."
                aria-label="Ask Nova AI"
                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleVoice}
                aria-label="Voice input"
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent-primary)] text-[var(--accent-on-primary)] disabled:opacity-40 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle Nova AI Assistant"
        className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-xl hover:border-[var(--accent-primary)] transition-all cursor-pointer"
      >
        <Sparkles className="h-4 w-4 text-[var(--accent-primary)]" />
        <span className="hidden sm:inline">Nova AI</span>
      </button>
    </div>
  );
}
