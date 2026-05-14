'use client';

import { useChatRail } from '@/components/chat/ChatRailContext';
import type { SimulatorOption } from '@/lib/plan-simulator';

/**
 * Client wrapper around the 3-option plan simulator. Renders pure data —
 * SimulatorOption[] is built server-side from the user's home + AI rec —
 * and wires each CTA into the chat rail's cart via applyAction.
 */
export function PlanSimulator({ options }: { options: SimulatorOption[] }) {
  const { applyAction } = useChatRail();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
      {options.map((o) => (
        <PlanCard key={o.planId} option={o} onSelect={() => applyAction(o.cta)} />
      ))}
    </div>
  );
}

function PlanCard({ option, onSelect }: { option: SimulatorOption; onSelect: () => void }) {
  const tagColor =
    option.tagTone === 'recommended'
      ? 'text-accent-green'
      : option.tagTone === 'current'
      ? 'text-text-secondary'
      : option.tagTone === 'savings'
      ? 'text-accent-green'
      : 'text-text-muted';

  const wrapperClass = option.isRecommended
    ? 'bg-hero-gradient border-wyze-green/30'
    : option.isCurrent
    ? 'bg-surface-2 border-subtle'
    : 'bg-surface-1 border-faint hover:bg-surface-2 transition-all';

  return (
    <div className={`rounded-[10px] p-5 border ${wrapperClass}`}>
      {/* Tag row — shows CURRENT, RECOMMENDED, both, or just the category */}
      <div className="flex items-center justify-between gap-2 mb-3 min-h-[14px]">
        <span className={`text-[10px] font-semibold tracking-[1.5px] uppercase ${tagColor}`}>
          {option.tag}
        </span>
        {option.isRecommended && !option.isCurrent && (
          <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-accent-green bg-accent-green/10 px-2 py-0.5 rounded">
            Recommended
          </span>
        )}
      </div>

      <div className="text-[15px] font-semibold mb-2">{option.name}</div>
      <div className="text-[28px] font-semibold tabular-nums leading-none mb-1">{option.priceLabel}</div>
      <div className="text-[11px] text-text-faint mb-4">{option.period}</div>

      <div className="text-[12px] mb-4 leading-snug">
        <div
          className={`font-semibold ${
            option.deltaTone === 'positive' ? 'text-accent-green' : 'text-text-secondary'
          }`}
        >
          {option.delta}
        </div>
        <div className="text-text-faint mt-0.5">{option.features}</div>
      </div>

      {option.isRecommended && option.reasonWhy && (
        <div className="text-[11px] text-accent-green mb-3 leading-snug">
          <span className="font-semibold">Why: </span>
          {option.reasonWhy}
        </div>
      )}

      <button
        onClick={onSelect}
        disabled={option.isCurrent}
        className={`w-full px-[14px] py-2 rounded-md text-[11.5px] transition-all ${
          option.isCurrent
            ? 'bg-surface-3 text-text-faint cursor-default'
            : option.isRecommended
            ? 'bg-wyze-green text-[#0a0a0a] font-semibold hover:bg-[#4dffd0]'
            : 'bg-transparent text-text-secondary border border-text-faint/50 hover:text-text-primary hover:border-text-muted'
        }`}
      >
        {option.cta}
      </button>
    </div>
  );
}
