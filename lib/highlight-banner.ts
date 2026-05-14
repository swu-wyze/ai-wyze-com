// AI-powered "highlight" recommendation — the wide banner under the products
// grid on Digest. Analyzes the user's fleet, plan, and recent events to surface
// ONE high-priority opportunity (plan trial, plan upgrade, or a specific add-on)
// with a reason rooted in their actual behavior.
//
// Cached in-memory per userId, same pattern as agent-opening and recommendations.

import { aiComplete, isAIConfigured } from './ai';
import { findProduct } from './product-catalog';
import type { Home } from './types';

export type HighlightAccent = 'purple' | 'green';

export interface HighlightBanner {
  /** ALL-CAPS short label tied to a specific signal in the user's data. */
  eyebrow: string;
  /** The recommendation. One short line. */
  title: string;
  /** Cost + one-line value statement, e.g. "+$10/mo · 24/7 dispatch + AI Video Search". */
  priceLine: string;
  /** The CTA button label. */
  ctaLabel: string;
  /** Product catalog slug for the avatar image. Use 'shield' for plan upgrades. */
  illustrationSlug: string;
  accent: HighlightAccent;
}

const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, { banner: HighlightBanner; expiresAt: number }>();

export async function getHighlightBanner(home: Home): Promise<HighlightBanner> {
  const cached = cache.get(home.user.id);
  if (cached && cached.expiresAt > Date.now()) return cached.banner;

  let banner: HighlightBanner | null = null;
  if (isAIConfigured()) banner = await generateHighlight(home);
  if (!banner) banner = hardcodedHighlight(home);

  cache.set(home.user.id, { banner, expiresAt: Date.now() + CACHE_TTL_MS });
  return banner;
}

async function generateHighlight(home: Home): Promise<HighlightBanner | null> {
  const result = await aiComplete({
    system: HIGHLIGHT_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildHighlightPrompt(home) }],
    maxTokens: 400,
    temperature: 0.5,
    responseFormat: 'json',
  });
  if (!result) return null;

  try {
    const parsed = JSON.parse(result.text) as Partial<HighlightBanner>;
    if (
      typeof parsed.eyebrow !== 'string' ||
      typeof parsed.title !== 'string' ||
      typeof parsed.priceLine !== 'string' ||
      typeof parsed.ctaLabel !== 'string' ||
      typeof parsed.illustrationSlug !== 'string'
    ) {
      return null;
    }
    return {
      eyebrow: parsed.eyebrow.toUpperCase().slice(0, 60),
      title: parsed.title.slice(0, 90),
      priceLine: parsed.priceLine.slice(0, 100),
      ctaLabel: parsed.ctaLabel.slice(0, 40),
      illustrationSlug: parsed.illustrationSlug,
      accent: parsed.accent === 'green' ? 'green' : 'purple',
    };
  } catch (err) {
    console.error('[highlight-banner] non-JSON AI output:', result.text.slice(0, 200), err);
    return null;
  }
}

const HIGHLIGHT_SYSTEM_PROMPT = `You analyze a Wyze user's profile, fleet, plan, and recent events to surface ONE high-impact recommendation as a hero banner on their dashboard.

TASK
Read the data. Find the single most valuable next step for this specific user — based on a real pattern in their events, NOT a generic upsell. Output a banner.

WYZE PLANS (use these EXACT names and prices — there is NO "Cam Plus Pro" plan):
- Cam Plus: $2.99/mo per camera. Full clips + 14-day history.
- Cam Unlimited: $9.99/mo unlimited cameras. Cam Plus features + facial recognition + multi-cam timeline.
- Cam Unlimited Pro: $19.99/mo unlimited cameras. Cam Unlimited + AI Video Search + 60-day history + 24/7 emergency dispatch. (Pro is the ONLY plan with AI Video Search and dispatch.)

HOW TO CHOOSE THE BANNER
- User with NO PLAN: pitch a Cam Plus trial OR Cam Unlimited if they have 3+ cameras. Tie it to specific clipped events ("12 events on Baby cam clipped this week").
- User on Cam Plus × N (N < fleet size): pitch Cam Unlimited if math works out, OR adding Cam Plus to a specific unprotected cam if there's a strong signal there (e.g. clipped baby cry).
- User on Cam Unlimited: pitch Cam Unlimited Pro IF their data justifies dispatch/Pro features (e.g. baby cry, security incident, package theft pattern). Pro is for safety-sensitive use cases, NOT general upgrades.
- User on Cam Unlimited Pro: pitch a complementary hardware product (Floodlight, Lock Bolt, doorbell). No more plan upsells.

CONSTRAINTS
- The eyebrow must reference something specific from the events or fleet, ALL CAPS, under 50 chars. Cite real data — a camera name, a behavior, a time.
- The title is the recommendation in plain language.
- The priceLine carries the value: cost + the most relevant feature ("+$10/mo · 24/7 dispatch on Angie's 3 AM alerts").
- The ctaLabel uses one of these patterns: "Try [plan] free for 14 days", "Add [product] to cart", "Upgrade to [plan]".
- illustrationSlug must be one of: shield (for plan upgrades), or any product slug from the catalog provided.
- accent: 'purple' for Cam Unlimited Pro upgrade, 'green' for Cam Plus / Cam Unlimited / hardware add-ons.

OUTPUT
A JSON object EXACTLY in this shape — no prose, no markdown fences:
{
  "eyebrow": "...",
  "title": "...",
  "priceLine": "...",
  "ctaLabel": "...",
  "illustrationSlug": "...",
  "accent": "green" or "purple"
}`;

function buildHighlightPrompt(home: Home): string {
  const cams = home.cameras
    .map((c) => {
      const tier = c.tier === 'free' ? 'FREE — 12s clips only' : 'Covered (full clips)';
      const missed = c.missedEvents ? `, ${c.missedEvents} truncated` : '';
      return `- ${c.name} (${c.model}) — ${tier} — ${c.eventsThisWeek}/wk${missed} — ${c.aiHighlight}`;
    })
    .join('\n');

  const eventLines = home.events
    .flatMap((d) =>
      d.items.map((e) => `[${d.day.split(' · ')[0].slice(0, 3)}] ${e.time} · ${e.cam} · ${stripStrong(e.text)}${e.flagged ? '  [FLAGGED]' : ''}`)
    )
    .slice(0, 25)
    .join('\n');

  return `USER: ${home.user.name} · ${home.user.location}
PLAN: ${home.subs.planName}${home.subs.currentMonthly > 0 ? ` ($${home.subs.currentMonthly.toFixed(2)}/mo)` : ''}

FLEET (${home.cameras.length} cameras)
${cams}

THIS WEEK (${home.thisWeek.range}): ${home.thisWeek.totalEvents} events · ${home.thisWeek.packages} packages · ${home.thisWeek.unfamiliarFaces} unfamiliar faces · ${home.thisWeek.babyCries} baby cry alerts

RECENT EVENTS (most recent first):
${eventLines}

CATALOG SLUGS YOU MAY USE FOR illustrationSlug:
- shield (use for any plan trial/upgrade)
- doorbell-pro, floodlight-pro, lock-bolt, cam-og, cam-pan-v4, cam-v4, battery-cam-pro, climate-sensor, window-cam

Return the banner as JSON.`;
}

function stripStrong(s: string): string {
  return s.replace(/<\/?strong>/g, '');
}

// ============================================================================
// Per-user fallbacks
// ============================================================================

function hardcodedHighlight(home: Home): HighlightBanner {
  switch (home.user.id) {
    case 'owen':
      return {
        eyebrow: 'BOTH CAMS ON FREE — 25 CLIPS CUT SHORT',
        title: 'Start with Cam Plus on Front Door',
        priceLine: '$2.99/mo · full clips + 14-day history · 14-day free trial',
        ctaLabel: 'Try Cam Plus free for 14 days',
        illustrationSlug: 'shield',
        accent: 'green',
      };
    case 'bob':
      return {
        eyebrow: 'BABY CRY AT 2:14 AM — CLIPPED AT 12s',
        title: 'Cam Unlimited covers all 3 for $9.99/mo',
        priceLine: '+$7/mo over your current plan · full clips on Baby + Deck',
        ctaLabel: 'Try Cam Unlimited free for 14 days',
        illustrationSlug: 'shield',
        accent: 'green',
      };
    case 'sunny':
    default:
      return {
        eyebrow: "ANGIE'S 3 AM ALERTS — UPGRADE FOR DISPATCH",
        title: 'Upgrade to Cam Unlimited Pro',
        priceLine: '+$10/mo · 24/7 emergency dispatch + AI Video Search + 60-day history',
        ctaLabel: 'Try Cam Unlimited Pro free for 14 days',
        illustrationSlug: 'shield',
        accent: 'purple',
      };
  }
}

/**
 * Resolves an illustrationSlug to an image URL. 'shield' returns the SVG
 * shield path; product slugs return the catalog imageSrc; fallback returns null.
 */
export function resolveIllustration(slug: string): string | null {
  if (slug === 'shield') return null; // caller renders an SVG
  return findProduct(slug)?.imageSrc ?? null;
}
