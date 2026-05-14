'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Video, Bell, Shield, Home, ChevronRight } from 'lucide-react';
import { useChatRail } from '@/components/chat/ChatRailContext';

const APPS = [
  { href: '/digest', label: 'Digest', icon: Sparkles },
  { href: '/cameras', label: 'Cameras', icon: Video },
  { href: '/events', label: 'Events', icon: Bell, badgeKey: 'flagged' as const },
  { href: '/plans', label: 'Plans', icon: Shield },
];

/**
 * Secondary nav — the app launcher inside "My Home". Visually presents as
 * the content panel of the active "My Home" tab in the TopNav.
 */
export function SecondaryNav() {
  const pathname = usePathname();
  const { home } = useChatRail();

  const onlineCount = home.cameras.filter((c) => c.online).length;
  const total = home.cameras.length;
  const flaggedCount = home.events.reduce(
    (n, d) => n + d.items.filter((i) => i.flagged).length,
    0
  );

  return (
    <nav className="h-11 flex items-center gap-1 px-4 sm:px-8 border-b border-faint sticky top-14 z-[99] relative bg-surface-1 overflow-x-auto scrollbar-hide">
      <span className="hidden sm:flex items-center gap-1.5 mr-5 shrink-0 whitespace-nowrap relative z-10">
        <Home size={11} className="text-wyze-green" />
        <span className="text-[9px] font-semibold tracking-[1.5px] text-text-secondary">MY HOME</span>
        <ChevronRight size={10} className="text-text-faint -mx-0.5" />
      </span>
      {APPS.map(({ href, label, icon: Icon, badgeKey }) => {
        const isActive = pathname === href;
        const badge = badgeKey === 'flagged' && flaggedCount > 0 ? String(flaggedCount) : null;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-[7px] px-3 py-1.5 text-xs rounded-md transition-all shrink-0 whitespace-nowrap relative z-10 ${
              isActive
                ? 'bg-wyze-green/15 text-wyze-green font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
            }`}
          >
            <Icon size={13} className={isActive ? 'text-wyze-green' : 'text-text-muted'} />
            <span>{label}</span>
            {badge && (
              <span className="text-[9px] bg-wyze-green text-[#0a0a0a] px-1.5 rounded-lg font-semibold">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
      <div className="ml-auto hidden sm:flex items-center gap-[7px] text-[11px] text-text-muted shrink-0 whitespace-nowrap relative z-10 pl-4">
        <span className="w-[5px] h-[5px] rounded-full bg-wyze-green shadow-[0_0_8px_rgba(29,240,187,0.6)]" />
        <span>
          {onlineCount === total ? `All ${total} cams online` : `${onlineCount} of ${total} cams online`}
        </span>
      </div>
    </nav>
  );
}
