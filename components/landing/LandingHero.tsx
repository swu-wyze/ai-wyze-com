'use client';

interface HeroCard {
  href: string;
  eyebrow: string;
  title: string;
  benefit: string;
  media: { kind: 'video'; src: string } | { kind: 'image'; src: string };
}

const CARDS: HeroCard[] = [
  {
    href: 'https://www.wyze.com/products/wyze-window-cam',
    eyebrow: 'Indoor · No drill',
    title: 'Window Cam',
    benefit: 'Suction-mount on glass. Watch the porch without drilling a hole.',
    media: { kind: 'video', src: '/assets/videos/windowcam.mp4' },
  },
  {
    href: 'https://www.wyze.com/products/wyze-battery-cam-pro',
    eyebrow: 'Wire-free · Outdoor',
    title: 'Battery Cam Pro',
    benefit: 'Mount anywhere. No wires. Months of battery.',
    media: { kind: 'video', src: '/assets/videos/batterycampro.mp4' },
  },
  {
    href: 'https://www.wyze.com/products/wyze-battery-doorbell-pro',
    eyebrow: 'Wire-free · Front door',
    title: 'Battery Video Doorbell',
    benefit: "Skip the wiring. See who's there from anywhere.",
    media: { kind: 'video', src: '/assets/videos/batterydoorbell.mp4' },
  },
  {
    href: 'https://www.wyze.com/products/wyze-cam-floodlight-pro',
    eyebrow: 'Outdoor · Lighted',
    title: 'Flood Cam Pro',
    benefit: 'Light up the yard the moment someone arrives.',
    media: { kind: 'image', src: '/assets/products/floodcampro.png' },
  },
  {
    href: 'https://www.wyze.com/products/wyze-scale-ultra',
    eyebrow: 'Health · In-home',
    title: 'Scale Ultra Body Scan',
    benefit: "See what's changing — beyond just the number on the scale.",
    media: { kind: 'image', src: '/assets/products/scaleultrabs.png' },
  },
];

/**
 * Horizontal-scroll product gallery at the top of the landing. Mirrors the
 * original wyzeai.html `.hero` section — videos autoplay muted on visible
 * cards, image fallbacks for two product shots, side-by-side at lg+.
 */
export function LandingHero() {
  return (
    <section aria-label="Featured Wyze products" className="bg-bg-base">
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 sm:px-6 lg:px-8 py-3 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible lg:snap-none">
        {CARDS.map((card) => (
          <a
            key={card.title}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative shrink-0 snap-center w-[78%] sm:w-[44%] lg:w-auto aspect-[3/4] rounded-2xl overflow-hidden bg-black/5 focus:outline-none focus:ring-2 focus:ring-accent-green/50"
          >
            {card.media.kind === 'video' ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
                <source src={card.media.src} type="video/mp4" />
              </video>
            ) : (
              <img
                src={card.media.src}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
              <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-white/85 mb-1">
                {card.eyebrow}
              </p>
              <h2 className="text-[20px] sm:text-[22px] font-bold leading-tight tracking-tight mb-1">
                {card.title}
              </h2>
              <p className="text-[13px] text-white/80 leading-snug mb-3 line-clamp-2">
                {card.benefit}
              </p>
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-wyze-green">
                Shop now <span aria-hidden>→</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
