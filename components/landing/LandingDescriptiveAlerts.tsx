'use client';

import { useEffect, useRef, useState } from 'react';

const QUESTIONS = [
  'Kids home from school?',
  'Package delivered?',
  'Dog let out?',
  'Mom got home safe?',
  'Garage door closed?',
  'What was that noise?',
];

/**
 * "Never Wonder" hero — auto-rotating question marquee anchored by the
 * Descriptive Alerts demo video. Mirrors the wyzeai.html .alerts-spot
 * section but as a self-contained React component.
 */
export function LandingDescriptiveAlerts() {
  const [idx, setIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % QUESTIONS.length), 2200);
    return () => clearInterval(t);
  }, []);

  // Autoplay the video once it enters the viewport (saves bandwidth above-the-fold).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            void el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="never-wonder"
      className="relative bg-[#0B0E13] text-white overflow-hidden py-16 sm:py-24"
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
        <div className="relative h-[1.4em] w-full" aria-live="polite" aria-atomic="true">
          {QUESTIONS.map((q, i) => (
            <span
              key={q}
              className={`absolute inset-0 flex items-center justify-center text-[28px] sm:text-[40px] lg:text-[52px] font-bold leading-tight tracking-tight transition-all duration-500 ${
                i === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              {q}
            </span>
          ))}
        </div>

        <h1
          id="never-wonder"
          className="text-[44px] sm:text-[64px] lg:text-[88px] font-extrabold leading-[0.95] tracking-[-0.03em]"
          style={{
            background: 'linear-gradient(115deg, #1E8EFF 0%, #2DDDB3 55%, #1E8EFF 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          Never Wonder.
        </h1>

        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Demo of Wyze descriptive AI alerts"
          className="w-full max-w-[760px] rounded-2xl border border-white/10 mt-2"
        >
          <source src="/assets/videos/descriptivealerts.mp4" type="video/mp4" />
        </video>

        <p className="text-[15px] sm:text-[17px] text-white/72">
          with <span className="font-semibold text-white">Wyze Descriptive Alerts</span>
        </p>

        <a
          href="#plans-compare"
          className="inline-flex items-center gap-2 mt-4 px-5 py-3 rounded-full bg-wyze-green text-[#0a0a0a] font-semibold text-[14px] hover:bg-[#4dffd0] transition-colors"
        >
          Our Plans <span aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}
