'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Video, Bell, Shield, Home, ChevronRight } from 'lucide-react';

const APPS = [
  { href: '/digest', label: 'Digest', icon: Sparkles },
  { href: '/cameras', label: 'Cameras', icon: Video },
  { href: '/events', label: 'Events', icon: Bell, badge: '3' },
  { href: '/plans', label: 'Plans', icon: Shield },
];

/**
 * Secondary nav — the app launcher inside "My Home". Visually presents as
 * the content panel of the active "My Home" tab in the TopNav: shared bg,
 * tinted tray surface, breadcrumb label with chevron.
 */
export function SecondaryNav() {
  const pathname = usePathname();

  return (
    <nav className="h-11 flex items-center gap-1 px-8 border-b border-white/[0.05] sticky top-14 z-[99] relative bg-white/[0.025]">
      {/* breadcrumb-style label — echoes the active 'My Home' in TopNav */}
      <span className="flex items-center gap-1.5 mr-5 shrink-0 whitespace-nowrap relative z-10">
        <Home size={11} className="text-wyze-green" />
        <span className="text-[9px] font-semibold tracking-[1.5px] text-text-secondary">MY HOME</span>
        <ChevronRight size={10} className="text-text-faint -mx-0.5" />
      </span>
      {APPS.map(({ href, label, icon: Icon, badge }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-[7px] px-3 py-1.5 text-xs rounded-md transition-all shrink-0 whitespace-nowrap relative z-10 ${
              isActive
                ? 'bg-wyze-green/15 text-wyze-green font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
            }`}
          >
            <Icon size={13} className={isActive ? 'text-wyze-green' : 'text-text-muted'} />
            <span>{label}</span>
            {badge && (
              <span className="text-[9px] bg-wyze-green text-bg-base px-1.5 rounded-lg font-semibold">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
      <div className="ml-auto flex items-center gap-[7px] text-[11px] text-text-muted shrink-0 whitespace-nowrap relative z-10">
        <span className="w-[5px] h-[5px] rounded-full bg-wyze-green shadow-[0_0_8px_rgba(29,240,187,0.6)]" />
        <span>All 4 cams online</span>
      </div>
    </nav>
  );
}
