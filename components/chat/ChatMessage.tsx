'use client';

import { parseAssistantMessage, renderInline } from '@/lib/chat-parser';

function InlineText({ text }: { text: string }) {
  const parts = renderInline(text);
  return (
    <>
      {parts.map((p, i) => {
        if (typeof p === 'string') {
          // Preserve paragraph breaks.
          return p.split('\n\n').map((para, j, all) => (
            <span key={`${i}-${j}`}>
              {para}
              {j < all.length - 1 && <span className="block h-2.5" aria-hidden />}
            </span>
          ));
        }
        if ('bold' in p && p.bold !== undefined) return <strong key={i} className="font-semibold">{p.bold}</strong>;
        if ('italic' in p && p.italic !== undefined) return <em key={i} className="italic text-text-muted">{p.italic}</em>;
        return null;
      })}
    </>
  );
}

interface AssistantContentProps {
  text: string;
  mode: 'ai' | 'scripted';
  /** Called when an [ACTION: Label] button is clicked. */
  onAction?: (label: string) => void;
}

export function AssistantContent({ text, mode, onAction }: AssistantContentProps) {
  const blocks = parseAssistantMessage(text);
  return (
    <div className="text-[13px] leading-relaxed">
      <div className="text-[10px] text-text-faint mb-2">
        Wyze · {mode === 'ai' ? 'analyzed your fleet' : 'checked your fleet'}
      </div>
      {blocks.map((b, i) => {
        if (b.kind === 'text') {
          return (
            <p key={i} className="text-[13px] leading-relaxed mb-2.5 last:mb-0">
              <InlineText text={b.content} />
            </p>
          );
        }
        if (b.kind === 'card') {
          const isRec = b.cardType === 'recommended';
          return (
            <div
              key={i}
              className={`rounded-[10px] p-3.5 mb-2.5 ${
                isRec
                  ? 'bg-wyze-green/[0.08] border border-wyze-green/25'
                  : 'bg-surface-2 border border-faint'
              }`}
            >
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className={`text-[13px] font-semibold ${isRec ? 'text-wyze-green' : ''}`}>{b.title}</span>
                {b.price && (
                  <span className={`text-[13px] tabular-nums shrink-0 ${isRec ? 'text-wyze-green font-semibold' : 'text-text-muted'}`}>
                    {b.price}
                  </span>
                )}
              </div>
              {b.note && <div className="text-[11.5px] text-text-secondary leading-snug">{b.note}</div>}
            </div>
          );
        }
        if (b.kind === 'bars') {
          return (
            <div
              key={i}
              className="rounded-[10px] p-3.5 mb-2.5 bg-surface-1 border border-faint"
            >
              {b.rows.map((r, j) => (
                <div key={j} className={j < b.rows.length - 1 ? 'mb-3' : ''}>
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className={r.highlight ? 'text-wyze-green font-semibold' : 'text-text-secondary'}>{r.label}</span>
                    <span className={r.highlight ? 'text-wyze-green font-semibold tabular-nums' : 'text-text-muted tabular-nums'}>
                      {r.amount}
                    </span>
                  </div>
                  <div className="bg-surface-3 rounded h-2 overflow-hidden">
                    <div
                      className={`h-full rounded transition-[width] duration-700 ease-out ${
                        r.highlight ? 'bg-wyze-green' : 'bg-text-muted/70'
                      }`}
                      style={{ width: `${r.widthPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          );
        }
        if (b.kind === 'actions') {
          return (
            <div key={i} className="flex flex-wrap gap-2 mt-3">
              {b.actions.map((label, j) => (
                <button
                  key={label}
                  onClick={() => onAction?.(label)}
                  className={
                    j === 0
                      ? 'bg-wyze-green text-[#0a0a0a] px-[14px] py-2 rounded-md font-semibold text-[11.5px] hover:bg-[#4dffd0] hover:-translate-y-px transition-all'
                      : 'bg-transparent text-text-secondary border border-text-faint/50 px-[14px] py-2 rounded-md text-[11.5px] hover:text-text-primary hover:border-text-muted transition-all'
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
