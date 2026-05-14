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

export function ChatRailProvider({ children, home, openingMessage, initialMode = 'default' }: ProviderProps) {
  const [mode, setMode] = useState<RailMode>(initialMode);
  const [tab, setTab] = useState<RailTab>('chat');
  const [turns, setTurns] = useState<Turn[]>([
    { role: 'assistant', content: openingMessage, mode: 'scripted' },
  ]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(true);

  const sendMessage = useCallback(
    async (raw: string) => {
      const prompt = raw.trim();
      if (!prompt || isTyping) return;
      // Any send is treated as commitment — escalate the rail into takeover so
      // the conversation dominates the UI (and the cart canvas is visible).
      setMode('takeover');
      setTab('chat');
      const nextTurns: Turn[] = [...turns, { role: 'user', content: prompt }];
      setTurns(nextTurns);
      setIsTyping(true);
      const minDelay = new Promise((r) => setTimeout(r, 650));
      try {
        const apiMessages = nextTurns.map((t) => ({ role: t.role, content: t.content }));
        const [{ text, mode: replyMode }] = await Promise.all([chat(apiMessages), minDelay]);
        setTurns([...nextTurns, { role: 'assistant', content: text, mode: replyMode }]);
        setHasNewMessages(true);
      } finally {
        setIsTyping(false);
      }
    },
    [turns, isTyping]
  );

  /**
   * Three behaviors depending on what the action label looks like:
   *   1. Maps to a cart item (plan trial / hardware / license reassignment) →
   *      add to cart, pop the canvas open on first commit.
   *   2. Already in cart → ignore the second tap (no double-add).
   *   3. Anything else (navigational, comparative, "see X" / "compare X" /
   *      "show me X") → treat as a chat query so the AI handles it.
   */
  const applyAction = useCallback(
    (label: string) => {
      const item = parseActionToCartItem(label);
      if (item) {
        const isAlreadyIn = cart.some((p) => p.id === item.id);
        if (isAlreadyIn) return;
        const wasEmpty = cart.length === 0;
        setCart((prev) => [...prev, item]);
        if (wasEmpty) {
          setMode('takeover');
          setTab('chat');
        }
        return;
      }
      // No cart match — route the action label into the chat as a user message
      // so the AI explains, compares, or pulls up the requested clip.
      void sendMessage(label);
    },
    [cart, sendMessage]
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
        return `• Started **${item.name}**${
          item.badge === 'TRIAL' ? ' (14-day free trial — you won\'t be charged until day 15)' : ''
        }`;
      }
      if (item.kind === 'plan-change') {
        return `• ${item.name} — no billing change`;
      }
      const price = item.oneTime !== undefined ? ` for $${item.oneTime.toFixed(2)}` : '';
      return `• Added **${item.name}**${price} to your order`;
    });

    const confirmation = `**Done.** Here's what changed:\n\n${lines.join('\n')}\n\nA confirmation email is on its way. Anything else?`;

    setTurns((prev) => [...prev, { role: 'assistant', content: confirmation, mode: 'scripted' }]);
    setCart([]);
    setTab('chat');
    setMode('default');
    setHasNewMessages(true);
  }, [cart]);

  /**
   * Adds a catalog product to the cart by slug. Used by inline product cards
   * rendered in chat — clicking the card's "Add to cart" button calls this
   * with the product's slug.
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
      if (wasEmpty) {
        setMode('takeover');
        setTab('chat');
      }
    },
    [cart]
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
