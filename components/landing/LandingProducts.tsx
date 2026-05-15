interface Collection {
  href: string;
  imgSrc: string;
  title: string;
  tag: string;
  cta: string;
}

const COLLECTIONS: Collection[] = [
  {
    href: 'https://www.wyze.com/collections/cameras',
    imgSrc: '/assets/products/categories/cat-cameras.jpg',
    title: 'Cameras',
    tag: 'Eyes on what matters.',
    cta: 'Home security cams',
  },
  {
    href: 'https://www.wyze.com/collections/doorbells-locks',
    imgSrc: '/assets/products/categories/cat-monitoring.jpg',
    title: 'Doorbells & Locks',
    tag: "See who's there. Let them in from anywhere.",
    cta: 'Front-door security',
  },
  {
    href: 'https://www.wyze.com/collections/lighting',
    imgSrc: '/assets/products/categories/cat-smart-homes.jpg',
    title: 'Lighting',
    tag: 'Set the mood. Save on power.',
    cta: 'Smart lighting',
  },
  {
    href: 'https://www.wyze.com/collections/health-lifestyle',
    imgSrc: '/assets/products/categories/cat-health.jpg',
    title: 'Health & Lifestyle',
    tag: 'Reach your goals.',
    cta: 'Smart everyday gear',
  },
];

/**
 * Our Products — 4 category cards (Cameras / Doorbells / Lighting / Health).
 * Light-theme section sitting between Reviews and the chat takeover.
 */
export function LandingProducts() {
  return (
    <section aria-label="Browse products" className="bg-bg-base py-16 sm:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-8 sm:mb-12">
          <h3 className="text-[28px] sm:text-[40px] lg:text-[44px] font-bold tracking-[-0.024em] text-text-primary">
            Our Products
          </h3>
        </header>
        <nav
          aria-label="Shop by category"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
        >
          {COLLECTIONS.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="group relative block rounded-2xl overflow-hidden h-[200px] lg:h-[280px] bg-[#EFE7DC] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,30,0.11)] transition-all"
            >
              <div className="absolute inset-0">
                <img
                  src={c.imgSrc}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover object-right transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(248, 242, 234, 0.92) 0%, rgba(248, 242, 234, 0.78) 28%, rgba(248, 242, 234, 0.32) 52%, rgba(248, 242, 234, 0) 68%)',
                  }}
                />
              </div>
              <div className="relative z-[1] p-6 lg:p-8 flex flex-col gap-2 max-w-[60%] h-full justify-center">
                <h4 className="text-[22px] lg:text-[28px] font-extrabold tracking-[-0.022em] leading-tight text-text-primary">
                  {c.title}
                </h4>
                <p className="text-[13px] lg:text-[15px] text-text-muted leading-snug">{c.tag}</p>
                <span className="self-start mt-2 px-4 py-2 rounded-full bg-wyze-green text-[#0a0a0a] text-[12px] font-bold transition-colors group-hover:bg-wyze-green-dark group-hover:text-white">
                  {c.cta}
                </span>
              </div>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
