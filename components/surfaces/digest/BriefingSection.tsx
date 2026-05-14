import { Sparkles } from 'lucide-react';
import type { Briefing } from '@/lib/briefing';

/**
 * The page-anchored briefing — what the agent has noticed this session. Lives
 * at the top of Digest. Renders the same content that used to be stuffed into
 * the chat thread (where auto-scroll buried it).
 */
export function BriefingSection({ briefing }: { briefing: Briefing }) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
          <Sparkles size={14} className="text-[#0a0a0a]" />
        </span>
        <span className="text-[10px] font-semibold tracking-[1.5px] uppercase text-text-faint">
          Wyze Intelligence · Briefing
        </span>
      </div>

      <h1 className="text-[26px] sm:text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] mb-2 text-text-primary">
        {briefing.greeting}
      </h1>
      <p className="text-[14px] sm:text-[15px] text-text-secondary leading-relaxed mb-6 max-w-[760px]">
        {briefing.subtitle}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {briefing.observations.map((card, i) => (
          <article
            key={i}
            className={`rounded-2xl p-5 border ${
              card.flagged
                ? 'bg-wyze-green/[0.08] border-wyze-green/25'
                : 'bg-surface-1 border-faint'
            }`}
          >
            <h3
              className={`font-semibold text-[15px] leading-snug mb-1.5 ${
                card.flagged ? 'text-wyze-green' : 'text-text-primary'
              }`}
            >
              {card.title}
            </h3>
            <p className="text-[12.5px] text-text-secondary leading-relaxed">{card.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
