import { Search, ShoppingCart } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import type { User } from '@/lib/types';

const NAV_ITEMS = [
  { label: 'Cameras', href: '#', active: false },
  { label: 'Smart Home', href: '#', active: false },
  { label: 'Lifestyle', href: '#', active: false },
  { label: 'My Home', href: '/digest', active: true },
];

/**
 * Primary nav — matches Wyze.com's main site nav (Cameras / Smart Home /
 * Lifestyle) plus "My Home" as the entry point into this dashboard. My Home
 * is the active entry because we're inside it.
 */
export function TopNav({ user }: { user: User }) {
  return (
    <nav className="h-14 flex justify-between items-center px-4 sm:px-8 bg-bg-base sticky top-0 z-[100]">
      <div className="flex items-center gap-6 lg:gap-9 min-w-0">
        <BrandLogo size="sm" />
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-current={item.active ? 'page' : undefined}
            className={
              // On mobile (<md), only show the active "My Home" entry — the rest
              // collapse to give the avatar + cart room. Full row appears at md+.
              `${item.active ? 'flex' : 'hidden md:flex'} ${
                item.active
                  ? 'text-[13px] text-wyze-green font-medium relative after:content-[""] after:absolute after:-bottom-[20px] after:left-0 after:right-0 after:h-[2px] after:bg-wyze-green after:z-10'
                  : 'text-[13px] text-text-secondary hover:text-text-primary cursor-pointer'
              }`
            }
          >
            {item.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3 sm:gap-[14px]">
        <Search size={16} className="hidden sm:block text-text-muted hover:text-text-primary cursor-pointer" />
        <ShoppingCart size={16} className="text-text-muted hover:text-text-primary cursor-pointer" />
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </nav>
  );
}
