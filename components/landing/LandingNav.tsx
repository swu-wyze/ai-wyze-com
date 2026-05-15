import { BrandLogo } from '@/components/chrome/BrandLogo';

const NAV_ITEMS = [
  { label: 'Cameras', href: 'https://www.wyze.com/collections/cameras' },
  { label: 'Smart Home', href: 'https://www.wyze.com/collections/smart-home' },
  { label: 'Lifestyle', href: 'https://www.wyze.com/collections/health-lifestyle' },
];

/**
 * Pre-auth top nav. Mirrors the post-auth TopNav layout but swaps the user
 * menu for a Sign in link (the only real semantic difference between the
 * two surfaces).
 */
export function LandingNav() {
  return (
    <nav className="h-14 flex justify-between items-center px-4 sm:px-8 bg-bg-base sticky top-0 z-[100]">
      <div className="flex items-center gap-6 lg:gap-9 min-w-0">
        <BrandLogo size="sm" />
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="hidden md:flex text-[13px] text-text-secondary hover:text-text-primary cursor-pointer"
          >
            {item.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3 sm:gap-[14px]">
        <a
          href="/login"
          className="text-[13px] font-semibold text-accent-green hover:text-text-primary"
        >
          Sign in
        </a>
      </div>
    </nav>
  );
}
