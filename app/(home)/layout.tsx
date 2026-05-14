import { redirect } from 'next/navigation';
import { TopNav } from '@/components/chrome/TopNav';
import { SecondaryNav } from '@/components/chrome/SecondaryNav';
import { ChatRail } from '@/components/chrome/ChatRail';
import { ChatRailProvider } from '@/components/chat/ChatRailContext';
import { buildAgentOpening } from '@/lib/agent-opening';
import { getCurrentHome } from '@/lib/home-data';
import { getCurrentUserId } from '@/lib/auth';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login');

  const home = await getCurrentHome();
  const opening = await buildAgentOpening(home);

  return (
    <ChatRailProvider home={home} openingMessage={opening}>
      <div className="min-h-screen flex flex-col bg-bg-base">
        <TopNav user={home.user} />
        <SecondaryNav />
        <div className="flex flex-1 min-h-0 relative">
          <ChatRail />
          <main className="flex-1 min-w-0 overflow-x-hidden">
            {/* Mobile gets tighter side padding + extra bottom padding so the
                floating chat FAB doesn't overlap content. */}
            <div className="px-4 sm:px-6 lg:px-9 py-6 sm:py-8 pb-28 md:pb-12 max-w-[1180px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ChatRailProvider>
  );
}
