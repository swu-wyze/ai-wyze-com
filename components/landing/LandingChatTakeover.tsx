'use client';

import { ChatRail } from '@/components/chrome/ChatRail';
import { useChatRail } from '@/components/chat/ChatRailContext';

/**
 * On /landing we don't want the persistent ChatRail sidebar (default mode)
 * or the floating action button (collapsed mode) — the in-section onboarding
 * composer is the single entry point. We DO still want the full-screen
 * takeover overlay to render once the user submits a prompt, so we mount
 * ChatRail only when its mode flips to 'takeover'.
 */
export function LandingChatTakeover() {
  const { mode } = useChatRail();
  if (mode !== 'takeover') return null;
  return <ChatRail />;
}
