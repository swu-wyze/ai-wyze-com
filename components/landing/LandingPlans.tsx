'use client';

import { useState } from 'react';

type Tier = 'free' | 'plus' | 'unlimited' | 'pro';

interface PlanCard {
  tier: Tier;
  name: string;
  tag: string;
  pitch: string;
  monthly: { amt: string; sub: string };
  annual?: { amt: string; sub: string; savePct: string };
  features: { text: string; tone: 'ok' | 'meh' | 'no' }[];
  bestFor: string;
  ctaHref: string;
  ctaLabel: string;
  ribbon?: string;
  accent: 'free' | 'plus' | 'unlimited' | 'pro';
}

const PLANS: PlanCard[] = [
  {
    tier: 'free',
    name: 'Free',
    tag: 'Included with every cam',
    pitch: 'Live view, motion clips, the essentials. A capable starter if you only need to peek in once in a while.',
    monthly: { amt: '$0', sub: 'forever' },
    features: [
      { text: 'Live view, anywhere on mobile', tone: 'ok' },
      { text: '12-second motion thumbnails', tone: 'ok' },
      { text: 'Basic motion detection', tone: 'ok' },
      { text: '5-minute cooldown between clips', tone: 'meh' },
      { text: 'No video recording history', tone: 'no' },
      { text: 'No person/pet/package alerts', tone: 'no' },
      { text: 'No Friendly Faces', tone: 'no' },
      { text: 'No Web View on desktop', tone: 'no' },
    ],
    bestFor: 'Indoor pet check-ins, an occasional look-in',
    ctaHref: 'https://www.wyze.com/collections/cameras',
    ctaLabel: 'Shop cameras',
    accent: 'free',
  },
  {
    tier: 'plus',
    name: 'Cam Plus',
    tag: '30-day free trial',
    pitch: 'Power up one Wyze Cam with AI alerts and 14-day cloud video — the upgrade most people pick.',
    monthly: { amt: '$2.99', sub: '/mo per camera' },
    annual: { amt: '$29.99', sub: '/yr per camera · ~$2.50/mo', savePct: 'Save 16%' },
    features: [
      { text: '<strong>14-day video recordings</strong> in the cloud', tone: 'ok' },
      { text: '<strong>Back-to-back recording</strong>, no cooldown', tone: 'ok' },
      { text: 'Person, Pet, Vehicle &amp; Package alerts', tone: 'ok' },
      { text: 'Sound detections (barking, glass, smoke)', tone: 'ok' },
      { text: 'Rich animated GIF notifications', tone: 'ok' },
      { text: 'Wyze Web View on desktop', tone: 'ok' },
      { text: 'AI Video Search', tone: 'ok' },
      { text: 'Friendly Faces (facial recognition)', tone: 'ok' },
    ],
    bestFor: 'One camera you actually want to be smart',
    ctaHref: 'https://www.wyze.com/pages/service-plans',
    ctaLabel: 'Start free trial',
    accent: 'plus',
  },
  {
    tier: 'unlimited',
    name: 'Cam Unlimited',
    tag: 'Covers every cam',
    pitch: 'One plan, every camera. Everything in Cam Plus, plus a multi-cam timeline, self-monitoring modes, and a Friendly Faces library worth building.',
    monthly: { amt: '$9.99', sub: '/mo · unlimited cameras' },
    annual: { amt: '$99', sub: '/yr · ~$8.25/mo', savePct: 'Save 17%' },
    features: [
      { text: '<strong>Unlimited cameras</strong> under one plan', tone: 'ok' },
      { text: 'Everything in Cam Plus, on every cam', tone: 'ok' },
      { text: '<strong>Multi-camera timeline</strong> — jump across cams', tone: 'ok' },
      { text: '<strong>Self-monitoring</strong> Home / Away / Disarm modes', tone: 'ok' },
      { text: 'My Day event insights &amp; Home Summary', tone: 'ok' },
      { text: 'Descriptive Alerts (AI-narrated)', tone: 'ok' },
      { text: 'Exclusive subscriber discounts', tone: 'ok' },
      { text: 'Share with up to 5 household members', tone: 'ok' },
    ],
    bestFor: 'Two or more cams, a doorbell, a real setup',
    ctaHref: 'https://www.wyze.com/pages/service-plans',
    ctaLabel: 'Start free trial',
    ribbon: '★ Most popular',
    accent: 'unlimited',
  },
  {
    tier: 'pro',
    name: 'Cam Unlimited Pro',
    tag: 'Premium tier',
    pitch: 'Everything in Cam Unlimited, plus 60-day cloud, 24/7 emergency dispatch, and the NBD filter that strips notification noise down to what matters.',
    monthly: { amt: '$19.99', sub: '/mo · unlimited cameras' },
    annual: { amt: '$199.99', sub: '/yr · ~$16.66/mo', savePct: 'Save 17%' },
    features: [
      { text: '<strong>Everything in Cam Unlimited</strong>, on every cam', tone: 'ok' },
      { text: '<strong>Up to 60-day cloud recording</strong> (toggle on/off)', tone: 'ok' },
      { text: '<strong>24/7 emergency dispatch</strong> — medical, police, fire', tone: 'ok' },
      { text: '<strong>NBD filter</strong> — cuts the notification noise', tone: 'ok' },
      { text: 'Descriptive Alerts (AI-narrated)', tone: 'ok' },
      { text: 'AI Video Search — sort by relevance or date', tone: 'ok' },
      { text: 'Advanced home automations', tone: 'ok' },
      { text: 'Subscriber-exclusive deals &amp; discounts', tone: 'ok' },
    ],
    bestFor: 'A real security posture — long retention, dispatch, smart filtering',
    ctaHref: 'https://www.wyze.com/products/cam-unlimited-pro',
    ctaLabel: 'Get Cam Unlimited Pro',
    ribbon: '◆ Most comprehensive',
    accent: 'pro',
  },
];

const MATRIX_ROWS: (string | React.ReactNode)[][] = [
  ['Cameras covered', 'Per device', <>1 per license <small className="opacity-60">(max 3)</small></>, 'Unlimited', 'Unlimited'],
  ['Cloud video recording', 'Thumbnails only', '14 days', '14 days · every cam', 'Up to 60 days · every cam'],
  ['Delay between recordings', '5 minutes', 'Back-to-back', 'Back-to-back', 'Back-to-back'],
  ['Person, Pet, Vehicle, Package detection', '—', '✓', '✓', '✓'],
  ['Sound detections (barking, glass, smoke)', '—', '✓', '✓', '✓'],
  ['Friendly Faces (facial recognition)', '—', '✓', '✓', '✓'],
  ['Rich animated GIF notifications', '—', '✓', '✓', '✓'],
  ['Wyze Web View on desktop', '—', '✓', '✓', '✓'],
  ['AI Video Search', '—', '✓', '✓', '✓'],
  ['Descriptive Alerts (AI-narrated)', '—', '✓', '✓', '✓'],
  ['Multi-camera timeline', '—', '—', '✓', '✓ (up to 4 live)'],
  ['Self-monitoring modes (Home / Away)', '—', '—', '✓', '✓'],
  ['My Day & Home Summary', '—', '—', '✓', '✓'],
  ['24/7 emergency dispatch', '—', '—', '—', '✓ Pro-exclusive'],
  ['NBD filter (notification noise reduction)', '—', '—', '—', '✓ Pro-exclusive'],
  ['Advanced home automations', '—', '—', '—', '✓'],
  ['Subscriber discounts on hardware', '—', '✓', '✓', '✓'],
];

const accentMap: Record<PlanCard['accent'], { border: string; ribbon: string; tag: string; cta: string }> = {
  free: {
    border: 'border-white/12',
    ribbon: '',
    tag: 'bg-white/8 text-white/70 border-white/12',
    cta: 'bg-white/10 text-white border-white/20 hover:bg-white/15',
  },
  plus: {
    border: 'border-[rgba(30,142,255,0.34)]',
    ribbon: '',
    tag: 'bg-[rgba(30,142,255,0.14)] text-[#5BC0FF] border-[rgba(30,142,255,0.32)]',
    cta: 'bg-gradient-to-br from-[#0074E4] to-[#1E8EFF] text-white hover:opacity-90',
  },
  unlimited: {
    border: 'border-[rgba(45,221,179,0.4)]',
    ribbon:
      'bg-gradient-to-r from-[#2DDDB3] via-[#5BC0FF] to-[#2DDDB3] text-[#0B0E13]',
    tag: 'bg-[rgba(45,221,179,0.14)] text-[#2DDDB3] border-[rgba(45,221,179,0.34)]',
    cta: 'bg-gradient-to-br from-[#6C5CE7] to-[#8E7CF8] text-white hover:opacity-90',
  },
  pro: {
    border: 'border-[rgba(200,164,255,0.4)]',
    ribbon: 'bg-gradient-to-r from-[#C8A4FF] via-[#5BC0FF] to-[#C8A4FF] text-[#0B0E13]',
    tag: 'bg-[rgba(200,164,255,0.16)] text-[#C8A4FF] border-[rgba(200,164,255,0.38)]',
    cta:
      'bg-[#1A2330] text-white border border-[rgba(200,164,255,0.45)] hover:border-[rgba(200,164,255,0.7)]',
  },
};

function FeatureLi({ tone, html }: { tone: 'ok' | 'meh' | 'no'; html: string }) {
  const mark = tone === 'ok' ? '✓' : tone === 'meh' ? '~' : '✗';
  const color =
    tone === 'ok' ? 'text-[#2DDDB3]' : tone === 'meh' ? 'text-white/55' : 'text-white/35';
  return (
    <li className="flex gap-2 items-start text-[13px] text-white/82 leading-snug">
      <span className={`${color} font-bold w-3 shrink-0 mt-0.5`}>{mark}</span>
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </li>
  );
}

function PlanCardEl({ plan }: { plan: PlanCard }) {
  const [isAnnual, setIsAnnual] = useState(false);
  const a = accentMap[plan.accent];
  const showAnnualToggle = !!plan.annual;
  const priced = isAnnual && plan.annual ? plan.annual : plan.monthly;

  return (
    <article
      className={`relative flex flex-col rounded-2xl border ${a.border} bg-white/[0.02] overflow-hidden`}
    >
      {plan.ribbon && (
        <div
          className={`absolute top-3 right-3 z-10 text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full ${a.ribbon}`}
        >
          {plan.ribbon}
        </div>
      )}

      <div className="p-5 lg:p-6 flex flex-col flex-1 gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[20px] lg:text-[24px] font-bold tracking-[-0.018em] text-white">
            {plan.name}
          </span>
          <span className={`text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border ${a.tag}`}>
            {plan.tag}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[32px] lg:text-[40px] font-extrabold leading-none tracking-[-0.022em] text-white">
            {priced.amt}
          </span>
          <span className="text-[12px] text-white/60">{priced.sub}</span>
        </div>

        <p className="text-[13px] text-white/75 leading-snug">{plan.pitch}</p>

        <ul className="flex flex-col gap-2 mt-1">
          {plan.features.map((f, i) => (
            <FeatureLi key={i} tone={f.tone} html={f.text} />
          ))}
        </ul>

        {showAnnualToggle && (
          <div className="flex flex-col gap-3 pt-4 border-t border-white/8 mt-auto">
            <div className="flex items-center gap-2">
              <span
                className={`text-[12px] font-semibold ${!isAnnual ? 'text-white' : 'text-white/55'}`}
              >
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setIsAnnual((v) => !v)}
                aria-pressed={isAnnual}
                aria-label="Switch billing frequency"
                className="relative w-11 h-6 rounded-full border border-white/20 cursor-pointer"
                style={{
                  background: isAnnual
                    ? 'linear-gradient(135deg, #0074E4, #1E8EFF)'
                    : 'rgba(255,255,255,0.12)',
                }}
              >
                <span
                  className="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: isAnnual ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
              <span
                className={`text-[12px] font-semibold ${isAnnual ? 'text-white' : 'text-white/55'}`}
              >
                Annual
              </span>
              {plan.annual && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#2DDDB3] bg-[rgba(45,221,179,0.12)] transition-opacity ${
                    isAnnual ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {plan.annual.savePct}
                </span>
              )}
            </div>
            <a
              href={plan.ctaHref}
              className={`block w-full text-center py-3 rounded-xl text-[14px] font-semibold transition-all ${a.cta}`}
            >
              {plan.ctaLabel}
            </a>
          </div>
        )}

        {!showAnnualToggle && (
          <div className="mt-auto pt-4">
            <a
              href={plan.ctaHref}
              className={`block w-full text-center py-3 rounded-xl text-[14px] font-semibold transition-all ${a.cta}`}
            >
              {plan.ctaLabel}
            </a>
          </div>
        )}

        <div className="pt-3 border-t border-white/8 flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-[0.12em] text-white/45 font-semibold">
            Best for
          </span>
          <span className="text-[13px] text-white/78 leading-snug">{plan.bestFor}</span>
        </div>
      </div>
    </article>
  );
}

/**
 * Plans compare section — 4 plan cards + side-by-side matrix.
 * Mirrors the wyzeai.html .plans-compare section.
 */
export function LandingPlans() {
  return (
    <section
      id="plans-compare"
      aria-labelledby="plans-compare-title"
      className="bg-[#0B0E13] text-white py-16 sm:py-24"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 lg:mb-16">
          <h2
            id="plans-compare-title"
            className="text-[36px] sm:text-[52px] lg:text-[64px] font-extrabold leading-[1.05] tracking-[-0.028em]"
          >
            Capable out of the box,
            <br />
            <span
              style={{
                background: 'linear-gradient(115deg, #1E8EFF 0%, #2DDDB3 55%, #1E8EFF 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              smarter with Security Plans.
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-white/65 max-w-[760px] mx-auto leading-relaxed">
            Free is capable. Cam Plus, Cam Unlimited, and Cam Unlimited Pro unlock the AI alerts,
            cloud recordings, and Friendly Faces that turn every clip into something you actually
            understand.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {PLANS.map((p) => (
            <PlanCardEl key={p.tier} plan={p} />
          ))}
        </div>

        {/* Side-by-side matrix */}
        <div className="mt-16 lg:mt-24">
          <header className="text-center mb-6">
            <h3 className="text-[24px] lg:text-[32px] font-bold tracking-[-0.022em]">Side-by-side</h3>
            <p className="text-[14px] text-white/55 mt-1">Every feature, every plan.</p>
          </header>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="px-4 py-3 font-semibold w-[36%]">Feature</th>
                  <th className="px-4 py-3 font-semibold">Free</th>
                  <th className="px-4 py-3 font-semibold text-[#5BC0FF]">Cam Plus</th>
                  <th className="px-4 py-3 font-semibold text-[#2DDDB3]">Cam Unlimited</th>
                  <th className="px-4 py-3 font-semibold text-[#C8A4FF]">Cam Unlimited Pro</th>
                </tr>
              </thead>
              <tbody>
                {MATRIX_ROWS.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]">
                    {row.map((cell, j) => {
                      const isHead = j === 0;
                      const text = typeof cell === 'string' ? cell : null;
                      const isYes = text === '✓' || (text && text.startsWith('✓'));
                      const isNo = text === '—';
                      return isHead ? (
                        <th
                          key={j}
                          scope="row"
                          className="px-4 py-3 font-medium text-white/82"
                        >
                          {cell}
                        </th>
                      ) : (
                        <td
                          key={j}
                          className={`px-4 py-3 ${
                            isYes ? 'text-[#2DDDB3] font-semibold' : isNo ? 'text-white/32' : 'text-white/82'
                          }`}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
