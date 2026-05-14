'use client';

import { Plus, Sparkles } from 'lucide-react';
import { parseAssistantMessage, renderInline } from '@/lib/chat-parser';
import { findProduct } from '@/lib/product-catalog';

function InlineText({ text }: { text: string }) {
  const parts = renderInline(text);
  return (
    <>
      {parts.map((p, i) => {
        if (typeof p === 'string') {
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
  /** Called when an [ACTION: Label] or [CHIP: Label] button is clicked. */
  onAction?: (label: string) => void;
  /** Called when an inline product card's "Add to cart" is clicked. */
  onAddProduct?: (slug: string) => void;
}

export function AssistantContent({ text, mode, onAction, onAddProduct }: AssistantContentProps) {
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

        if (b.kind === 'thinking') {
          return (
            <div
              key={i}
              className="mb-3 pl-3 border-l-2 border-accent-purple/40 bg-accent-purple/[0.06] rounded-r-md py-2 pr-3"
            >
              <div className="flex items-center gap-1.5 mb-1 text-accent-purple">
                <Sparkles size={11} />
                <span className="text-[9.5px] font-bold tracking-[1.5px] uppercase">Thinking</span>
              </div>
              <div className="text-[12px] text-accent-purple/90 leading-snug">
                <InlineText text={b.content} />
              </div>
            </div>
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
                <span className={`text-[13px] font-semibold ${isRec ? 'text-accent-green' : ''}`}>{b.title}</span>
                {b.price && (
                  <span className={`text-[13px] tabular-nums shrink-0 ${isRec ? 'text-accent-green font-semibold' : 'text-text-muted'}`}>
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
            <div key={i} className="rounded-[10px] p-3.5 mb-2.5 bg-surface-1 border border-faint">
              {b.rows.map((r, j) => (
                <div key={j} className={j < b.rows.length - 1 ? 'mb-3' : ''}>
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className={r.highlight ? 'text-accent-green font-semibold' : 'text-text-secondary'}>{r.label}</span>
                    <span className={r.highlight ? 'text-accent-green font-semibold tabular-nums' : 'text-text-muted tabular-nums'}>
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

        if (b.kind === 'product') {
          const product = findProduct(b.slug);
          if (!product) return null;
          return (
            <div
              key={i}
              className="rounded-[12px] mb-2.5 bg-surface-1 border border-faint overflow-hidden flex items-stretch"
            >
              <div className="w-[88px] h-[88px] bg-[#f4f4f4] flex items-center justify-center shrink-0">
                <img src={product.imageSrc} alt={product.name} className="max-h-[80%] max-w-[80%] object-contain" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0 px-3.5 py-2.5 flex flex-col justify-between gap-1.5">
                <div>
                  <div className="text-[13px] font-semibold text-text-primary leading-tight mb-0.5">{product.name}</div>
                  <div className="text-[11px] text-text-muted leading-snug line-clamp-2">{product.pitch}</div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[13px] font-semibold tabular-nums">{product.price}</span>
                    {product.strikePrice && (
                      <span className="text-[10px] text-text-faint line-through tabular-nums">{product.strikePrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => onAddProduct?.(b.slug)}
                    className="flex items-center gap-1 bg-wyze-green text-[#0a0a0a] px-2.5 py-1 rounded-md font-semibold text-[10.5px] hover:bg-[#4dffd0] transition-colors"
                  >
                    <Plus size={11} strokeWidth={2.5} />
                    Add to cart
                  </button>
                </div>
              </div>
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

        if (b.kind === 'chips') {
          // Inline quick-reply pills. Clicking sends the label as the user's next message.
          return (
            <div key={i} className="flex flex-wrap gap-2 mt-3">
              {b.chips.map((label) => (
                <button
                  key={label}
                  onClick={() => onAction?.(label)}
                  className="text-[11.5px] text-text-secondary border border-faint rounded-full px-3.5 py-1.5 hover:bg-surface-2 hover:border-subtle hover:text-text-primary transition-all"
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
