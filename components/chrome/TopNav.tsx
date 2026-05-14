import { Search, ShoppingCart } from 'lucide-react';

/**
 * Primary nav — matches Wyze.com's main site nav (Cameras / Smart Home /
 * Lifestyle) plus "My Home" as the entry point into this dashboard. My Home
 * is the active entry because we're inside it.
 */

const NAV_ITEMS = [
  { label: 'Cameras', href: '#', active: false },
  { label: 'Smart Home', href: '#', active: false },
  { label: 'Lifestyle', href: '#', active: false },
  { label: 'My Home', href: '/digest', active: true },
];

export function TopNav() {
  return (
    <nav className="h-14 flex justify-between items-center px-8 bg-bg-base sticky top-0 z-[100]">
      <div className="flex items-center gap-9">
        <span className="text-base font-semibold tracking-[2px] bg-brand-gradient bg-clip-text text-transparent">
          WYZE
        </span>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-current={item.active ? 'page' : undefined}
            className={
              item.active
                ? 'text-[13px] text-wyze-green font-medium relative after:content-[""] after:absolute after:-bottom-[20px] after:left-0 after:right-0 after:h-[2px] after:bg-wyze-green after:z-10'
                : 'text-[13px] text-text-secondary hover:text-text-primary cursor-pointer'
            }
          >
            {item.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-[18px]">
        <Search size={16} className="text-text-muted hover:text-text-primary cursor-pointer" />
        <ShoppingCart size={16} className="text-text-muted hover:text-text-primary cursor-pointer" />
        <div className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center text-[11px] font-semibold text-bg-base">
          S
        </div>
      </div>
    </nav>
  );
}
