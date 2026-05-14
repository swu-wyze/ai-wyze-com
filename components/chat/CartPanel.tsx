'use client';

import { ShoppingCart, X, ArrowRight } from 'lucide-react';
import { cartTotals } from '@/lib/cart';
import { useChatRail } from './ChatRailContext';
import { getHome } from '@/lib/home-data';

/**
 * Cart view. Used in two contexts:
 *  - Rail "Cart" tab when the rail is in default mode (compact, full width of rail)
 *  - LiveCanvas pane when the rail is in takeover mode (sits beside the chat)
 */
export function CartPanel({ variant = 'rail' }: { variant?: 'rail' | 'canvas' }) {
  const { cart, removeFromCart, clearCart } = useChatRail();
  const home = getHome();
  const totals = cartTotals(cart, home.subs.currentMonthly);

  return (
    <div className="flex flex-col h-full">
      {variant === 'canvas' && (
        <div className="px-4 pt-4 pb-3 border-b border-white/[0.05]">
          <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-wyze-green mb-1">
            Live · updating
          </div>
          <div className="text-[15px] font-semibold">Your system</div>
          <div className="text-[11px] text-text-faint">Building as you decide</div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 min-h-0">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 text-text-faint">
            <ShoppingCart size={28} className="mb-3 opacity-40" />
            <div className="text-[12px] leading-relaxed max-w-[220px]">
              Accept a recommendation in chat and it&apos;ll show up here.
            </div>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className={`bg-white/[0.04] border rounded-[10px] p-3 flex items-start gap-3 ${
                item.kind === 'plan'
                  ? 'border-wyze-green/25'
                  : item.kind === 'plan-change'
                  ? 'border-wyze-purple-light/25'
                  : 'border-white/[0.08]'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <div className="text-[12.5px] font-semibold leading-tight">{item.name}</div>
                  {item.badge && (
                    <span
                      className={`text-[8.5px] font-semibold tracking-[0.5px] px-1.5 py-0.5 rounded uppercase shrink-0 ${
                        item.kind === 'plan'
                          ? 'bg-wyze-green/20 text-wyze-green'
                          : item.kind === 'plan-change'
                          ? 'bg-wyze-purple/20 text-wyze-purple-light'
                          : 'bg-white/[0.08] text-text-muted'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.detail && (
                  <div className="text-[10.5px] text-text-faint leading-snug mb-1.5">{item.detail}</div>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-[11.5px] tabular-nums">
                    {item.monthly !== undefined && item.monthly > 0 && (
                      <span className="text-wyze-green font-semibold">${item.monthly.toFixed(2)}/mo</span>
                    )}
                    {item.oneTime !== undefined && (
                      <span className="text-text-primary font-semibold">${item.oneTime.toFixed(2)}</span>
                    )}
                    {item.kind === 'plan-change' && (
                      <span className="text-wyze-purple-light font-semibold">$0 · no charge</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-text-faint hover:text-text-secondary"
                    aria-label="Remove from cart"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-3 border-t border-white/[0.05] bg-white/[0.02] flex flex-col gap-1.5">
        <div className="flex justify-between text-[11px]">
          <span className="text-text-muted">Monthly</span>
          <span
            className={`tabular-nums ${
              totals.monthlySavings > 0 ? 'text-wyze-green font-semibold' : 'text-text-secondary'
            }`}
          >
            ${totals.monthly.toFixed(2)}/mo
            {totals.monthlySavings > 0 && (
              <span className="text-text-faint ml-2 text-[10px]">(save ${totals.monthlySavings.toFixed(2)}/mo)</span>
            )}
          </span>
        </div>
        {totals.oneTime > 0 && (
          <div className="flex justify-between text-[11px]">
            <span className="text-text-muted">One-time</span>
            <span className="tabular-nums text-text-secondary">${totals.oneTime.toFixed(2)}</span>
          </div>
        )}
        <button
          disabled={cart.length === 0}
          className="mt-2 w-full bg-wyze-green text-bg-base px-3 py-2.5 rounded-md font-semibold text-[12px] hover:bg-[#4dffd0] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          Apply changes
          <ArrowRight size={14} />
        </button>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-[10.5px] text-text-faint hover:text-text-secondary self-center mt-1"
          >
            Clear cart
          </button>
        )}
      </div>
    </div>
  );
}
