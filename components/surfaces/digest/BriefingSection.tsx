import type { Briefing } from '@/lib/briefing';

/**
 * The page-anchored briefing — greeting + cadence subtitle at the top of
 * Digest. The detailed observation cards used to live here too; we removed
 * them because they overlapped with the AI highlight banner and product
 * recs below. The Briefing type still carries `observations` if a future
 * surface wants them.
 */
export function BriefingSection({ briefing }: { briefing: Briefing }) {
  return (
    <section className="mb-10">
      <h1 className="text-[26px] sm:text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] mb-2 text-text-primary">
        {briefing.greeting}
      </h1>
      <p className="text-[14px] sm:text-[15px] text-text-secondary leading-relaxed">
        {briefing.subtitle}
      </p>
    </section>
  );
}
