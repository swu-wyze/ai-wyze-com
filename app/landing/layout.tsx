import { ChatRailProvider } from '@/components/chat/ChatRailContext';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingChatTakeover } from '@/components/landing/LandingChatTakeover';
import { getGuestHome, GUEST_OPENING_MESSAGE } from '@/lib/guest-home';

/**
 * Public pre-auth landing. Same ChatRail state plumbing as the post-auth
 * /digest layout, but unlike /digest the persistent sidebar/FAB are hidden —
 * the in-page onboarding composer is the only entry point into chat. Once
 * the user submits a prompt, LandingChatTakeover renders the full-screen
 * overlay so the chat experience itself is identical to post-auth.
 */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const home = getGuestHome();
  return (
    <ChatRailProvider home={home} openingMessage={GUEST_OPENING_MESSAGE} initialMode="collapsed">
      <div className="min-h-screen flex flex-col bg-bg-base">
        <LandingNav />
        <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
        <LandingChatTakeover />
      </div>
    </ChatRailProvider>
  );
}
