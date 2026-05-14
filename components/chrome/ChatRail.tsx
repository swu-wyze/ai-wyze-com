'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  ArrowUp,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  MessageSquare,
  ShoppingCart,
} from 'lucide-react';
import { AssistantContent } from '@/components/chat/ChatMessage';
import { CartPanel } from '@/components/chat/CartPanel';
import { useChatRail } from '@/components/chat/ChatRailContext';
import { startingChipsFor } from '@/lib/agent-opening';

/**
 * Three-state agent rail. Collapsed (64px) ⇆ Default (380px) ⇆ Takeover (full).
 * Default and collapsed are in-flow (the right pane resizes to fit). Takeover
 * is a fixed overlay so the surface keeps its layout underneath.
 */
export function ChatRail() {
  const {
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
    markRead,
  } = useChatRail();

  const startingChips = startingChipsFor(home);
  const [input, setInput] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [turns, isTyping, mode]);

  useEffect(() => {
    if (mode !== 'collapsed' && hasNewMessages) markRead();
  }, [mode, hasNewMessages, markRead]);

  // ---------- COLLAPSED ----------
  if (mode === 'collapsed') {
    return (
      <>
        <MobileFab onOpen={() => setMode('takeover')} hasNewMessages={hasNewMessages} cartCount={cart.length} />
        <aside className="hidden md:flex w-[64px] shrink-0 bg-bg-sunken flex-col items-center pt-4 pb-4 gap-3">
        <button
          onClick={() => setMode('default')}
          className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center hover:scale-105 transition-all relative"
          aria-label="Open agent"
        >
          <Sparkles size={16} className="text-[#0a0a0a]" />
          {hasNewMessages && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-wyze-green border-2 border-bg-base" />
          )}
        </button>
        <button
          onClick={() => setMode('default')}
          className="w-9 h-9 rounded-md hover:bg-surface-2 flex items-center justify-center text-text-faint hover:text-text-secondary"
          aria-label="Expand agent"
        >
          <ChevronRight size={16} />
        </button>
        {cart.length > 0 && (
          <button
            onClick={() => {
              setMode('default');
              setTab('cart');
            }}
            className="w-9 h-9 rounded-md hover:bg-surface-2 flex items-center justify-center text-text-secondary relative"
            aria-label="Open cart"
          >
            <ShoppingCart size={15} />
            <span className="absolute -top-0.5 -right-0.5 text-[9px] bg-wyze-green text-[#0a0a0a] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
              {cart.length}
            </span>
          </button>
        )}
        </aside>
      </>
    );
  }

  // ---------- TAKEOVER ----------
  if (mode === 'takeover') {
    return (
      <>
        {/* placeholder keeps desktop's main width stable while overlay covers everything */}
        <aside className="hidden md:block w-[380px] shrink-0" aria-hidden />
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          onClick={() => setMode('default')}
          aria-hidden
        />
        <div className="fixed inset-0 md:inset-x-4 md:top-4 md:bottom-4 z-[151] grid grid-cols-1 md:grid-cols-[1fr_380px] grid-rows-[56px_1fr] bg-bg-base md:rounded-[16px] md:border md:border-subtle overflow-hidden md:shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
          {/* header */}
          <header className="md:col-span-2 px-4 md:px-5 flex items-center gap-2 md:gap-3 bg-bg-base">
            <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-[#0a0a0a]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate">Wyze Intelligence</div>
              <div className="text-[10.5px] text-text-faint flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-wyze-green shrink-0" />
                <span className="truncate">Watching your home · {turns.length - 1} turn{turns.length !== 2 ? 's' : ''}</span>
              </div>
            </div>
            {/* Mobile-only cart toggle (cart canvas is hidden on mobile, so we
                let users switch the main pane between chat and cart). */}
            <button
              onClick={() => setTab(tab === 'chat' ? 'cart' : 'chat')}
              className="md:hidden relative w-8 h-8 rounded-md flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-2"
              aria-label={tab === 'chat' ? 'View cart' : 'Back to chat'}
            >
              {tab === 'chat' ? <ShoppingCart size={15} /> : <MessageSquare size={15} />}
              {tab === 'chat' && cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-[8.5px] bg-wyze-green text-[#0a0a0a] font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setMode('default')}
              className="hidden md:flex items-center gap-1.5 text-[11.5px] text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-md hover:bg-surface-2"
            >
              <Minimize2 size={13} />
              <span>Collapse</span>
            </button>
            <button
              onClick={() => setMode('collapsed')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-2 hover:text-text-primary shrink-0"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </header>

          {/* chat pane — full row on mobile when tab=chat; left pane on desktop */}
          <div className={`${tab === 'cart' ? 'hidden md:flex' : 'flex'} flex-col min-h-0 md:bg-bg-sunken`}>
            <div ref={threadRef} className="flex-1 overflow-y-auto min-h-0">
              <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-5">
                {turns.map((t, i) =>
                  t.role === 'user' ? (
                    <div
                      key={i}
                      className="self-end max-w-[80%] bg-wyze-purple/25 rounded-[14px_14px_4px_14px] py-2.5 px-3.5 text-[13px]"
                    >
                      {t.content}
                    </div>
                  ) : (
                    <div key={i} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={14} className="text-[#0a0a0a]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <AssistantContent text={t.content} mode={t.mode ?? 'scripted'} onAction={applyAction} onAddProduct={addProductToCart} />
                      </div>
                    </div>
                  )
                )}
                {isTyping && <TypingIndicator />}
              </div>
            </div>
            <Composer
              value={input}
              onChange={setInput}
              onSubmit={() => {
                if (!input.trim()) return;
                void sendMessage(input);
                setInput('');
              }}
              isTyping={isTyping}
            />
          </div>

          {/* canvas: cart — full row on mobile when tab=cart; right pane on desktop */}
          <div className={`${tab === 'chat' ? 'hidden md:flex' : 'flex'} flex-col min-h-0`}>
            <CartPanel variant="canvas" />
          </div>
        </div>
      </>
    );
  }

  // ---------- DEFAULT (rail) — desktop only ----------
  return (
    <>
      <MobileFab onOpen={() => setMode('takeover')} hasNewMessages={hasNewMessages} cartCount={cart.length} />
      <aside className="hidden md:flex w-[380px] shrink-0 bg-bg-sunken flex-col sticky top-[100px] self-start h-[calc(100vh-100px)]">
      <header className="px-4 py-3 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center">
          <Sparkles size={14} className="text-[#0a0a0a]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold">Wyze Intelligence</div>
          <div className="text-[10px] text-text-faint flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-wyze-green" />
            Watching your home
          </div>
        </div>
        <button
          onClick={() => setMode('takeover')}
          className="w-7 h-7 rounded-md hover:bg-surface-2 flex items-center justify-center text-text-faint hover:text-text-secondary"
          aria-label="Expand to focus mode"
          title="Focus mode"
        >
          <Maximize2 size={13} />
        </button>
        <button
          onClick={() => setMode('collapsed')}
          className="w-7 h-7 rounded-md hover:bg-surface-2 flex items-center justify-center text-text-faint hover:text-text-secondary"
          aria-label="Collapse rail"
        >
          <ChevronLeft size={14} />
        </button>
      </header>

      {/* Tabs */}
      <div className="flex px-2 pt-1 pb-2 gap-1">
        <RailTabBtn
          active={tab === 'chat'}
          onClick={() => setTab('chat')}
          icon={<MessageSquare size={12} />}
          label="Chat"
        />
        <RailTabBtn
          active={tab === 'cart'}
          onClick={() => setTab('cart')}
          icon={<ShoppingCart size={12} />}
          label="Cart"
          badge={cart.length > 0 ? cart.length : undefined}
        />
      </div>

      {tab === 'chat' ? (
        <>
          <div ref={threadRef} className="flex-1 overflow-y-auto min-h-0 px-4 py-4 flex flex-col gap-4">
            {turns.map((t, i) =>
              t.role === 'user' ? (
                <div
                  key={i}
                  className="self-end max-w-[80%] bg-wyze-purple/25 rounded-[14px_14px_4px_14px] py-2.5 px-3.5 text-[13px]"
                >
                  {t.content}
                </div>
              ) : (
                <div key={i} className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-brand-gradient flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={12} className="text-[#0a0a0a]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <AssistantContent text={t.content} mode={t.mode ?? 'scripted'} onAction={applyAction} onAddProduct={addProductToCart} />
                  </div>
                </div>
              )
            )}
            {isTyping && <TypingIndicator />}
            {turns.length === 1 && !isTyping && (
              <div className="mt-2">
                <div className="text-[10px] uppercase tracking-[1.5px] text-text-faint mb-2">Or ask</div>
                <div className="flex flex-col gap-1.5">
                  {startingChips.map((c) => (
                    <button
                      key={c}
                      onClick={() => void sendMessage(c)}
                      className="text-left text-[11.5px] text-text-secondary border border-subtle rounded-md px-3 py-2 hover:bg-surface-2 hover:border-medium hover:text-text-primary transition-all"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Composer
            value={input}
            onChange={setInput}
            onSubmit={() => {
              if (!input.trim()) return;
              void sendMessage(input);
              setInput('');
            }}
            isTyping={isTyping}
          />
        </>
      ) : (
        <CartPanel variant="rail" />
      )}
      </aside>
    </>
  );
}

/**
 * Mobile-only floating action button. Renders when the rail is collapsed or
 * default (i.e., the user is not in takeover already). Tapping it opens the
 * full-screen takeover overlay, which is the only chat surface on mobile.
 */
function MobileFab({
  onOpen,
  hasNewMessages,
  cartCount,
}: {
  onOpen: () => void;
  hasNewMessages: boolean;
  cartCount: number;
}) {
  return (
    <button
      onClick={onOpen}
      className="md:hidden fixed bottom-5 right-5 z-[140] w-14 h-14 rounded-full bg-brand-gradient shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      aria-label="Open Wyze Intelligence"
    >
      <Sparkles size={22} className="text-[#0a0a0a]" />
      {hasNewMessages && (
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-wyze-green border-2 border-bg-base" />
      )}
      {cartCount > 0 && (
        <span className="absolute -bottom-1 -right-1 text-[10px] bg-wyze-green text-[#0a0a0a] font-semibold rounded-full w-5 h-5 flex items-center justify-center border-2 border-bg-base">
          {cartCount}
        </span>
      )}
    </button>
  );
}

function RailTabBtn({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] rounded-md transition-all ${
        active
          ? 'bg-wyze-green/15 text-wyze-green font-medium'
          : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-[9px] bg-wyze-green text-[#0a0a0a] px-1.5 rounded-full font-semibold">{badge}</span>
      )}
    </button>
  );
}

function Composer({
  value,
  onChange,
  onSubmit,
  isTyping,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isTyping: boolean;
}) {
  return (
    <div className="px-3 py-3 flex items-center gap-2 bg-bg-sunken shadow-[0_-8px_16px_-12px_rgba(0,0,0,0.45)]">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder="Ask your home anything…"
        className="flex-1 bg-surface-2 border border-subtle rounded-pill px-4 py-2 text-[12.5px] outline-none focus:border-wyze-green/40 focus:bg-surface-2 transition-all placeholder:text-text-faint"
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim() || isTyping}
        className="w-[28px] h-[28px] bg-wyze-green rounded-full flex items-center justify-center shrink-0 hover:bg-[#4dffd0] hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Send"
      >
        <ArrowUp size={13} className="text-[#0a0a0a]" />
      </button>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="w-6 h-6 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
        <Sparkles size={12} className="text-[#0a0a0a]" />
      </div>
      <div className="flex gap-1 items-center py-2">
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
      </div>
    </div>
  );
}
