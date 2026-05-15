'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  quote: string;
  author: string;
  product: string;
  source?: string;
}

const REVIEWS: Review[] = [
  {
    quote: 'Best purchase ever. Safety at ease. I will definitely recommend Wyze security cameras.',
    author: 'Verified Best Buy buyer',
    product: 'Wyze Cam Pan',
  },
  {
    quote: "Fantastic product. I've had Arlo, Canary, Samsung and Google cameras and the Wyze blows them away.",
    author: 'Verified Amazon buyer',
    product: 'Wyze Cam OG',
  },
  {
    quote: 'Both cameras have operated flawlessly. Wyze customer support was great, helpful, and patient.',
    author: 'Robert Hott',
    product: 'Trustpilot',
  },
  {
    quote: 'Very innovative and excellent home security system with clean and clear views day and night.',
    author: 'Louise F.',
    product: 'Wyze Bulb Cam',
    source: 'Trustpilot',
  },
  {
    quote: 'Honestly amazing. Easy setup and awesome nighttime picture quality.',
    author: 'Verified buyer',
    product: 'Wyze Doorbell',
    source: 'Best Buy',
  },
];

const ROTATE_MS = 6000;

/**
 * Reviews hero — "Trusted by 12+ million households" headline + auto-rotating
 * 5-star testimonial carousel. Prev/next buttons + manual scroll pause.
 */
export function LandingReviews() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % REVIEWS.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused]);

  const prev = () => setIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setIdx((i) => (i + 1) % REVIEWS.length);
  const review = REVIEWS[idx];

  return (
    <section
      aria-label="Customer reviews"
      className="relative bg-[#0B0E13] text-white overflow-hidden py-16 sm:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(30, 142, 255, 0.18), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(35, 196, 160, 0.10), transparent 55%)',
        }}
      />
      <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
        <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/55">
          Trusted by 12+ million households
        </p>

        <div className="relative w-full flex items-center gap-2 sm:gap-4">
          <button
            onClick={prev}
            type="button"
            aria-label="Previous review"
            className="hidden sm:flex w-10 h-10 rounded-full border border-white/15 bg-white/5 items-center justify-center text-white/65 hover:text-white hover:bg-white/10 shrink-0"
          >
            <ChevronLeft size={18} />
          </button>

          <article className="flex-1 min-w-0 flex flex-col items-center gap-4 transition-opacity duration-300" key={idx}>
            <div className="text-[#2DDDB3] text-[18px] tracking-[0.2em]" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <blockquote className="text-[20px] sm:text-[28px] lg:text-[34px] font-bold leading-snug tracking-[-0.018em] max-w-[800px]">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <footer className="flex flex-wrap items-center justify-center gap-2 text-[13px] text-white/68">
              <strong className="text-white/85">{review.author}</strong>
              <span aria-hidden>·</span>
              <span>{review.product}</span>
              {review.source && (
                <>
                  <span aria-hidden>·</span>
                  <span>{review.source}</span>
                </>
              )}
            </footer>
          </article>

          <button
            onClick={next}
            type="button"
            aria-label="Next review"
            className="hidden sm:flex w-10 h-10 rounded-full border border-white/15 bg-white/5 items-center justify-center text-white/65 hover:text-white hover:bg-white/10 shrink-0"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 mt-2" role="tablist" aria-label="Pick a review">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Review ${i + 1}`}
              type="button"
              onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === idx ? 'bg-[#2DDDB3] scale-110' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
