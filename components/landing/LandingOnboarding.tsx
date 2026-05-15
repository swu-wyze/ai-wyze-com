'use client';

import { useState } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useChatRail } from '@/components/chat/ChatRailContext';

interface Concern {
  key: string;
  label: string;
  benefit: string;
  prompt: string;
}

const SUGGESTIONS = [
  'Compare Cam Plus vs Cam Unlimited',
  'I rent — what works without drilling?',
  'Best setup under $200',
  'Do I really need a doorbell cam?',
];

const CONCERNS: Concern[] = [
  {
    key: 'package',
    label: 'Package theft',
    benefit: 'Catch porch pirates the moment they show up.',
    prompt: "I'm worried about package theft. What's the best setup to catch porch pirates?",
  },
  {
    key: 'intruders',
    label: 'Unwanted visitors',
    benefit: "Know who's at the door before you open it.",
    prompt: "I want to know who's at my door before I open it. What do you recommend?",
  },
  {
    key: 'vacation',
    label: 'Away from home',
    benefit: "Eyes on the house while you're on the road.",
    prompt: "I travel a lot and want eyes on the house while I'm away. What's the right setup?",
  },
  {
    key: 'family',
    label: 'Kids & pets',
    benefit: 'Check on the people who matter, from anywhere.',
    prompt: 'I want to check on my kids and pets when I\'m not home. What cameras work best?',
  },
];

/**
 * Pre-auth onboarding hero — merged Welcome-back + Wyatt greeting from the
 * original wyzeai.html. Each concern tile and the composer feed directly
 * into the ChatRail context: clicking sends the prompt and switches the rail
 * into takeover mode, so the user lands in a focused chat that's pixel-
 * identical to the post-auth /digest experience.
 */
export function LandingOnboarding() {
  const { sendMessage, setMode } = useChatRail();
  const [input, setInput] = useState('');

  const openWith = (text: string) => {
    setMode('takeover');
    void sendMessage(text);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    openWith(text);
    setInput('');
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="max-w-[760px] mx-auto">
        {/* Header — merged greeting + command-center secondary CTA */}
        <header className="flex flex-col items-center text-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center">
            <Sparkles size={28} className="text-[#0a0a0a]" />
          </div>
          <div>
            <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold leading-[1.1] tracking-[-0.02em] text-text-primary">
              What keeps you up at night?{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Let Wyze help.
              </span>
            </h1>
            <p className="mt-3 text-[14px] text-text-muted">
              Existing customer with devices?{' '}
              <a href="/digest" className="font-semibold text-accent-green hover:text-text-primary">
                Access My Home command center →
              </a>
            </p>
          </div>
        </header>

        {/* Concern tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {CONCERNS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => openWith(c.prompt)}
              className="text-left p-4 rounded-2xl border border-faint hover:border-medium bg-bg-elevated hover:bg-surface-1 transition-all group"
            >
              <div className="text-[14px] font-semibold text-text-primary mb-1">{c.label}</div>
              <div className="text-[12.5px] text-text-muted leading-snug">{c.benefit}</div>
            </button>
          ))}
        </div>

        {/* Composer — single chat entry point on the landing page.
            Larger pill input + wyze-green send + suggestion chips so it
            visually anchors the section instead of feeling like a footer. */}
        <div
          className="rounded-[20px] p-1 bg-brand-gradient"
          role="search"
          aria-label="Chat with Wyze Intelligence"
        >
          <form onSubmit={onSubmit} className="flex items-center gap-2 bg-bg-base rounded-[16px] pl-5 pr-2 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Or just tell me what you need…"
              className="flex-1 bg-transparent border-0 text-[15px] outline-none placeholder:text-text-faint text-text-primary py-2.5"
              aria-label="Describe your situation"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center gap-2 h-11 px-4 sm:px-5 bg-wyze-green rounded-full text-[#0a0a0a] font-semibold text-[13px] shrink-0 hover:bg-[#4dffd0] hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Send"
            >
              <span className="hidden sm:inline">Start chatting</span>
              <ArrowUp size={16} className="text-[#0a0a0a]" />
            </button>
          </form>
        </div>

        {/* Suggestion chips — quick-start prompts that bypass the typing step */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => openWith(s)}
              className="text-[12px] text-text-secondary border border-subtle bg-bg-elevated hover:border-medium hover:bg-surface-1 hover:text-text-primary rounded-full px-3.5 py-2 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
