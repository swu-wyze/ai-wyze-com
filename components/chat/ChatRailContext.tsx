'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { chat } from '@/app/actions/chat';
import type { CartItem } from '@/lib/cart';
import { cartItemFromProductSlug, parseActionToCartItem } from '@/lib/cart';
import { findProduct } from '@/lib/product-catalog';
import type { Home } from '@/lib/types';

export type RailMode = 'collapsed' | 'default' | 'takeover';
export type RailTab = 'chat' | 'cart';

type Turn = { role: 'user' | 'assistant'; content: string; mode?: 'ai' | 'scripted' };

interface ChatRailValue {
  home: Home;
  mode: RailMode;
  tab: RailTab;
  turns: Turn[];
  cart: CartItem[];
  isTyping: boolean;
  hasNewMessages: boolean;
  setMode: (m: RailMode) => void;
  setTab: (t: RailTab) => void;
  sendMessage: (prompt: string) => Promise<void>;
  applyAction: (label: string) => void;
  addProductToCart: (slug: string) => void;
  applyChanges: () => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  markRead: () => void;
}

const ChatRailCtx = createContext<ChatRailValue | null>(null);

export function useChatRail(): ChatRailValue {
  const v = useContext(ChatRailCtx);
  if (!v) throw new Error('useChatRail must be used within <ChatRailProvider>');
  return v;
}

interface ProviderProps {
  children: ReactNode;
  /** Active user's home (drives cart math + anything client-side that needs it). */
  home: Home;
  /** Pre-typed assistant opening message (rendered as if Claude spoke first). */
  openingMessage: string;
  /** Default starting mode for the rail. */
  initialMode?: RailMode;
}

// Action labels that map to UI control commands rather than chat queries or
// cart adds. Keeps "Continue to checkout" from being routed to the AI as if
// it were a question (and from being parsed into another cart-add).
const CONTROL_ACTIONS = new Set([
  'continue to checkout',
  'continue shopping',
  'apply this now',
]);

export function ChatRailProvider({ children, home, openingMessage, initialMode = 'default' }: ProviderProps) {
  const [mode, setMode] = useState<RailMode>(initialMode);
  const [tab, setTab] = useState<RailTab>('chat');
  const [turns, setTurns] = useState<Turn[]>([
    { role: 'assistant', content: openingMessage, mode: 'scripted' },
  ]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(true);

  /** Formats the current cart as a system-prompt fragment for cart-aware AI replies. */
  const buildCartSummary = useCallback((items: CartItem[]): string => {
    if (items.length === 0) return '';
    const lines = items.map((i) => {
      if (i.kind === 'plan') {
        return `- ${i.name} ($${(i.monthly ?? 0).toFixed(2)}/mo subscription, will replace any current plan)`;
      }
      if (i.kind === 'plan-change') {
        return `- ${i.name} (license reassignment, no billing change)`;
      }
      return `- ${i.name} ($${(i.oneTime ?? 0).toFixed(2)} hardware)`;
    });
    return lines.join('\n');
  }, []);

  const sendMessage = useCallback(
    async (raw: string) => {
      const prompt = raw.trim();
      if (!prompt || isTyping) return;
      setMode('takeover');
      setTab('chat');
      const nextTurns: Turn[] = [...turns, { role: 'user', content: prompt }];
      setTurns(nextTurns);
      setIsTyping(true);
      const minDelay = new Promise((r) => setTimeout(r, 650));
      try {
        const apiMessages = nextTurns.map((t) => ({ role: t.role, content: t.content }));
        const cartSummary = buildCartSummary(cart);
        const [{ text, mode: replyMode }] = await Promise.all([
          chat(apiMessages, cartSummary || undefined),
          minDelay,
        ]);
        setTurns([...nextTurns, { role: 'assistant', content: text, mode: replyMode }]);
        setHasNewMessages(true);
      } finally {
        setIsTyping(false);
      }
    },
    [turns, isTyping, cart, buildCartSummary]
  );

  /**
   * Inserts a deterministic confirmation message after a successful cart-add so
   * the user gets immediate acknowledgment in the chat thread (instead of the
   * AI hallucinating "Done" or the click being silent).
   */
  const insertCartConfirmation = useCallback(
    (item: CartItem) => {
      const msg = buildItemConfirmation(item, home);
      setTurns((prev) => [...prev, { role: 'assistant', content: msg, mode: 'scripted' }]);
      setHasNewMessages(true);
    },
    [home]
  );

  /**
   * Apply Changes — the "checkout" CTA in the cart canvas. Simulates committing
   * the cart: drops a confirmation assistant message into the thread, clears
   * the cart, and returns the rail to default mode so the user sees the result.
   */
  const applyChanges = useCallback(() => {
    if (cart.length === 0) return;

    const lines = cart.map((item) => {
      if (item.kind === 'plan') {
        const trialNote =
          item.badge === 'TRIAL'
            ? ' (30-day free trial — you won\'t be charged until day 31)'
            : '';
        return `• ${item.badge === 'UPGRADE' ? 'Switched to' : 'Started'} **${item.name}**${trialNote}`;
      }
      if (item.kind === 'plan-change') {
        return `• ${item.name} — no billing change`;
      }
      const price = item.oneTime !== undefined ? ` for $${item.oneTime.toFixed(2)}` : '';
      return `• Added **${item.name}**${price} to your order`;
    });

    const confirmation = `**Order placed.** Here's what changed:\n\n${lines.join('\n')}\n\nA confirmation email is on its way. Anything else?`;

    setTurns((prev) => [...prev, { role: 'assistant', content: confirmation, mode: 'scripted' }]);
    setCart([]);
    setTab('chat');
    setMode('default');
    setHasNewMessages(true);
  }, [cart]);

  /**
   * Click handler for any [ACTION:] or [CHIP:] button in chat. Routes the
   * label to the right destination:
   *   1. Control actions (Continue to checkout, etc.) → UI handlers
   *   2. Cart-mappable labels                          → add to cart + confirm
   *   3. Already in cart                               → no double-add
   *   4. Anything else                                 → send as user message
   */
  const applyAction = useCallback(
    (label: string) => {
      const normalized = label.trim().toLowerCase();

      // 1. Control actions
      if (CONTROL_ACTIONS.has(normalized)) {
        if (normalized === 'continue to checkout' || normalized === 'apply this now') {
          applyChanges();
        }
        // "continue shopping" — close cart, do nothing else
        if (normalized === 'continue shopping') {
          setTab('chat');
        }
        return;
      }

      // 2/3. Cart-mappable
      const item = parseActionToCartItem(label);
      if (item) {
        const isAlreadyIn = cart.some((p) => p.id === item.id);
        if (isAlreadyIn) {
          // Tell the user it's already there instead of doing nothing.
          setTurns((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `**${item.name}** is already in your cart. Want me to walk through what changes when you check out?\n\n[CHIP: Walk me through the changes]\n[ACTION: Continue to checkout]`,
              mode: 'scripted',
            },
          ]);
          setHasNewMessages(true);
          return;
        }
        const wasEmpty = cart.length === 0;
        setCart((prev) => [...prev, item]);
        insertCartConfirmation(item);
        if (wasEmpty) {
          setMode('takeover');
          setTab('chat');
        }
        return;
      }

      // 4. Route to chat
      void sendMessage(label);
    },
    [cart, sendMessage, applyChanges, insertCartConfirmation]
  );

  /**
   * Adds a catalog product to the cart by slug. Used by inline product cards
   * rendered in chat — clicking the card's "Add to cart" button calls this.
   */
  const addProductToCart = useCallback(
    (slug: string) => {
      const product = findProduct(slug);
      if (!product) return;
      const item = cartItemFromProductSlug(slug, product);
      const isAlreadyIn = cart.some((p) => p.id === item.id);
      if (isAlreadyIn) return;
      const wasEmpty = cart.length === 0;
      setCart((prev) => [...prev, item]);
      insertCartConfirmation(item);
      if (wasEmpty) {
        setMode('takeover');
        setTab('chat');
      }
    },
    [cart, insertCartConfirmation]
  );

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const markRead = useCallback(() => setHasNewMessages(false), []);

  const value = useMemo<ChatRailValue>(
    () => ({
      home,
      mode,
      tab,
      turns,
      cart,
      isTyping,
      hasNewMessages,
      setMode,
      setTab,
      sendMessage,
      applyAction,
      addProductToCart,
      applyChanges,
      removeFromCart,
      clearCart,
      markRead,
    }),
    [home, mode, tab, turns, cart, isTyping, hasNewMessages, sendMessage, applyAction, addProductToCart, applyChanges, removeFromCart, clearCart, markRead]
  );

  return <ChatRailCtx.Provider value={value}>{children}</ChatRailCtx.Provider>;
}

// ============================================================================
// Per-item confirmation messages — deterministic, no AI round trip.
// ============================================================================

function buildItemConfirmation(item: CartItem, home: Home): string {
  if (item.kind === 'plan') {
    const replacesNote =
      home.subs.currentMonthly > 0
        ? ` Replaces your current ${home.subs.planName} ($${home.subs.currentMonthly.toFixed(2)}/mo).`
        : '';
    const trialNote = item.badge === 'TRIAL' ? ' 30-day free trial — no charge until day 31.' : '';
    return `✓ **${item.name}** added to your cart.${replacesNote}${trialNote}

[CHIP: What's included?]
[CHIP: Walk me through the changes]
[ACTION: Continue to checkout]`;
  }

  if (item.kind === 'plan-change') {
    return `✓ Queued: **${item.name}**. No billing change — applies on checkout.

[CHIP: Why is this better?]
[ACTION: Apply this now]`;
  }

  const price = item.oneTime !== undefined ? ` ($${item.oneTime.toFixed(2)})` : '';
  return `✓ **${item.name}**${price} added to your cart.

[CHIP: What else pairs well?]
[CHIP: Help me set it up]
[ACTION: Continue to checkout]`;
}
