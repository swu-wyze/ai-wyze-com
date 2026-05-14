'use client';

import { Shield } from 'lucide-react';
import { useChatRail } from '@/components/chat/ChatRailContext';
import type { HighlightBanner as Banner } from '@/lib/highlight-banner';
import { resolveIllustration } from '@/lib/highlight-banner';

/**
 * Client wrapper that renders the AI-picked highlight banner and wires its
 * CTA into the chat rail's cart via applyAction. Sits on Digest below the
 * "Built around your home" grid.
 */
export function HighlightBanner({ highlight }: { highlight: Banner }) {
  const { applyAction } = useChatRail();
  const highlightImageSrc = resolveIllustration(highlight.illustrationSlug);

  const accentText = highlight.accent === 'purple' ? 'text-accent-purple' : 'text-accent-green';
  const accentBg = highlight.accent === 'purple' ? 'bg-accent-purple/[0.08]' : 'bg-wyze-green/[0.08]';
  const accentBorder =
    highlight.accent === 'purple' ? 'border-accent-purple/15' : 'border-wyze-green/20';
  const accentBtnBg =
    highlight.accent === 'purple'
      ? 'bg-accent-purple/15 hover:bg-accent-purple/25'
      : 'bg-wyze-green/15 hover:bg-wyze-green/25';
  const accentBtnBorder =
    highlight.accent === 'purple' ? 'border-accent-purple/25' : 'border-wyze-green/30';

  return (
    <div
      className={`${accentBg} border ${accentBorder} rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6`}
    >
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
          {highlightImageSrc ? (
            <img
              src={highlightImageSrc}
              alt=""
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
              loading="lazy"
            />
          ) : (
            <Shield size={22} className={accentText} />
          )}
        </div>
        <div className="min-w-0">
          <div
            className={`text-[10.5px] sm:text-[11px] font-bold tracking-[1.5px] uppercase mb-1.5 ${accentText}`}
          >
            {highlight.eyebrow}
          </div>
          <div className="text-[16px] sm:text-[17px] font-semibold mb-1 text-text-primary leading-snug">
            {highlight.title}
          </div>
          <div className="text-[12.5px] sm:text-[13px] text-text-muted">
            <span className={`font-semibold ${accentText}`}>
              {highlight.priceLine.split(' · ')[0]}
            </span>
            {highlight.priceLine.includes(' · ') && (
              <span> · {highlight.priceLine.split(' · ').slice(1).join(' · ')}</span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => applyAction(highlight.ctaLabel)}
        className={`${accentBtnBg} ${accentText} border ${accentBtnBorder} px-6 py-2.5 rounded-lg font-medium text-[13px] whitespace-nowrap transition-colors w-full sm:w-auto sm:shrink-0`}
      >
        {highlight.ctaLabel}
      </button>
    </div>
  );
}
