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
import { STARTING_CHIPS } from '@/lib/agent-opening';

/**
 * Three-state agent rail. Collapsed (64px) ⇆ Default (380px) ⇆ Takeover (full).
 * Default and collapsed are in-flow (the right pane resizes to fit). Takeover
 * is a fixed overlay so the surface keeps its layout underneath.
 */
export function ChatRail() {
  const {
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
    markRead,
  } = useChatRail();

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
      <aside className="w-[64px] shrink-0 bg-bg-base/[0.6] border-r border-white/[0.05] flex flex-col items-center pt-4 pb-4 gap-3 backdrop-blur-sm">
        <button
          onClick={() => setMode('default')}
          className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center hover:scale-105 transition-all relative"
          aria-label="Open agent"
        >
          <Sparkles size={16} className="text-bg-base" />
          {hasNewMessages && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-wyze-green border-2 border-bg-base" />
          )}
        </button>
        <button
          onClick={() => setMode('default')}
          className="w-9 h-9 rounded-md hover:bg-white/[0.05] flex items-center justify-center text-text-faint hover:text-text-secondary"
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
            className="w-9 h-9 rounded-md hover:bg-white/[0.05] flex items-center justify-center text-text-secondary relative"
            aria-label="Open cart"
          >
            <ShoppingCart size={15} />
            <span className="absolute -top-0.5 -right-0.5 text-[9px] bg-wyze-green text-bg-base font-semibold rounded-full w-4 h-4 flex items-center justify-center">
              {cart.length}
            </span>
          </button>
        )}
      </aside>
    );
  }

  // ---------- TAKEOVER ----------
  if (mode === 'takeover') {
    return (
      <>
        {/* placeholder keeps main's width stable while overlay covers everything */}
        <aside className="w-[380px] shrink-0" aria-hidden />
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          onClick={() => setMode('default')}
          aria-hidden
        />
        <div className="fixed inset-x-4 top-4 bottom-4 z-[151] grid grid-cols-[1fr_380px] grid-rows-[56px_1fr] bg-bg-base rounded-[16px] border border-white/[0.08] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
          {/* header */}
          <header className="col-span-2 px-5 flex items-center gap-3 border-b border-white/[0.05] bg-bg-base">
            <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center">
              <Sparkles size={14} className="text-bg-base" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold">Wyze Intelligence</div>
              <div className="text-[10.5px] text-text-faint flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-wyze-green" />
                Watching your home · {turns.length - 1} turn{turns.length !== 2 ? 's' : ''}
              </div>
            </div>
            <button
              onClick={() => setMode('default')}
              className="flex items-center gap-1.5 text-[11.5px] text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-md hover:bg-white/[0.05]"
            >
              <Minimize2 size={13} />
              <span>Collapse</span>
            </button>
            <button
              onClick={() => setMode('collapsed')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-white/[0.05] hover:text-text-primary"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </header>

          {/* chat pane */}
          <div className="flex flex-col min-h-0 border-r border-white/[0.05]">
            <div ref={threadRef} className="flex-1 overflow-y-auto min-h-0">
              <div className="max-w-[680px] mx-auto px-6 py-6 flex flex-col gap-5">
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
                        <Sparkles size={14} className="text-bg-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <AssistantContent text={t.content} mode={t.mode ?? 'scripted'} onAction={applyAction} />
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

          {/* canvas: cart */}
          <div className="flex flex-col min-h-0">
            <CartPanel variant="canvas" />
          </div>
        </div>
      </>
    );
  }

  // ---------- DEFAULT (rail) ----------
  return (
    <aside className="w-[380px] shrink-0 bg-bg-base/[0.85] border-r border-white/[0.05] flex flex-col backdrop-blur-sm sticky top-[100px] self-start h-[calc(100vh-100px)]">
      <header className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center">
          <Sparkles size={14} className="text-bg-base" />
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
          className="w-7 h-7 rounded-md hover:bg-white/[0.05] flex items-center justify-center text-text-faint hover:text-text-secondary"
          aria-label="Expand to focus mode"
          title="Focus mode"
        >
          <Maximize2 size={13} />
        </button>
        <button
          onClick={() => setMode('collapsed')}
          className="w-7 h-7 rounded-md hover:bg-white/[0.05] flex items-center justify-center text-text-faint hover:text-text-secondary"
          aria-label="Collapse rail"
        >
          <ChevronLeft size={14} />
        </button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.05] px-2 pt-2 gap-1">
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
                    <Sparkles size={12} className="text-bg-base" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <AssistantContent text={t.content} mode={t.mode ?? 'scripted'} onAction={applyAction} />
                  </div>
                </div>
              )
            )}
            {isTyping && <TypingIndicator />}
            {turns.length === 1 && !isTyping && (
              <div className="mt-2">
                <div className="text-[10px] uppercase tracking-[1.5px] text-text-faint mb-2">Or ask</div>
                <div className="flex flex-col gap-1.5">
                  {STARTING_CHIPS.map((c) => (
                    <button
                      key={c}
                      onClick={() => void sendMessage(c)}
                      className="text-left text-[11.5px] text-text-secondary border border-white/[0.07] rounded-md px-3 py-2 hover:bg-white/[0.04] hover:border-white/[0.15] hover:text-text-primary transition-all"
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
          : 'text-text-muted hover:text-text-primary hover:bg-white/[0.04]'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-[9px] bg-wyze-green text-bg-base px-1.5 rounded-full font-semibold">{badge}</span>
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
    <div className="border-t border-white/[0.05] px-3 py-3 flex items-center gap-2 bg-bg-base/[0.5]">
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
        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-pill px-4 py-2 text-[12.5px] outline-none focus:border-wyze-green/40 focus:bg-white/[0.06] transition-all placeholder:text-text-faint"
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim() || isTyping}
        className="w-[28px] h-[28px] bg-wyze-green rounded-full flex items-center justify-center shrink-0 hover:bg-[#4dffd0] hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Send"
      >
        <ArrowUp size={13} className="text-bg-base" />
      </button>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="w-6 h-6 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
        <Sparkles size={12} className="text-bg-base" />
      </div>
      <div className="flex gap-1 items-center py-2">
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
      </div>
    </div>
  );
}
