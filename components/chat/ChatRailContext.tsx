'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { chat } from '@/app/actions/chat';
import type { CartItem } from '@/lib/cart';
import { parseActionToCartItem } from '@/lib/cart';

export type RailMode = 'collapsed' | 'default' | 'takeover';
export type RailTab = 'chat' | 'cart';

type Turn = { role: 'user' | 'assistant'; content: string; mode?: 'ai' | 'scripted' };

interface ChatRailValue {
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
  /** Pre-typed assistant opening message (rendered as if Claude spoke first). */
  openingMessage: string;
  /** Default starting mode for the rail. */
  initialMode?: RailMode;
}

export function ChatRailProvider({ children, openingMessage, initialMode = 'default' }: ProviderProps) {
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

  const applyAction = useCallback(
    (label: string) => {
      const item = parseActionToCartItem(label);
      if (!item) {
        // Navigational or unrecognized action — just log for now.
        console.log('[chat action — navigational]', label);
        return;
      }
      const isAlreadyIn = cart.some((p) => p.id === item.id);
      if (isAlreadyIn) return;
      const wasEmpty = cart.length === 0;
      setCart((prev) => [...prev, item]);
      // The first commit pops the canvas open so the user sees the cart appear.
      // Subsequent adds just update the cart in place.
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
      removeFromCart,
      clearCart,
      markRead,
    }),
    [mode, tab, turns, cart, isTyping, hasNewMessages, sendMessage, applyAction, removeFromCart, clearCart, markRead]
  );

  return <ChatRailCtx.Provider value={value}>{children}</ChatRailCtx.Provider>;
}
