import { TopNav } from '@/components/chrome/TopNav';
import { SecondaryNav } from '@/components/chrome/SecondaryNav';
import { ChatRail } from '@/components/chrome/ChatRail';
import { ChatRailProvider } from '@/components/chat/ChatRailContext';
import { buildAgentOpening } from '@/lib/agent-opening';
import { getHome } from '@/lib/home-data';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const opening = buildAgentOpening(getHome());
  return (
    <ChatRailProvider openingMessage={opening}>
      <div className="min-h-screen flex flex-col bg-bg-base">
        <TopNav />
        <SecondaryNav />
        <div className="flex flex-1 min-h-0 relative">
          <ChatRail />
          <main className="flex-1 min-w-0 overflow-x-hidden">
            <div className="px-9 py-8 max-w-[1180px]">{children}</div>
          </main>
        </div>
      </div>
    </ChatRailProvider>
  );
}
