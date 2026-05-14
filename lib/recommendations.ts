// AI-powered product recommendations for the Digest "Built around your home"
// section. Same shape as agent-opening: AI when available, hardcoded fallback
// per user otherwise. In-memory cache keyed by userId.

import { aiComplete, isAIConfigured } from './ai';
import { CATALOG, findProduct, catalogForPrompt, type CatalogProduct } from './product-catalog';
import type { Home } from './types';

export interface Recommendation extends CatalogProduct {
  because: string;
}

const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, { items: Recommendation[]; expiresAt: number }>();

export async function getRecommendations(home: Home): Promise<Recommendation[]> {
  const cached = cache.get(home.user.id);
  if (cached && cached.expiresAt > Date.now()) return cached.items;

  let items: Recommendation[] | null = null;
  if (isAIConfigured()) items = await generateRecommendations(home);
  if (!items || items.length === 0) items = hardcodedRecommendations(home);

  cache.set(home.user.id, { items, expiresAt: Date.now() + CACHE_TTL_MS });
  return items;
}

interface AIRecommendationItem {
  slug: string;
  because: string;
}

async function generateRecommendations(home: Home): Promise<Recommendation[] | null> {
  const result = await aiComplete({
    system: RECS_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildRecsUserPrompt(home) }],
    maxTokens: 400,
    temperature: 0.4,
    responseFormat: 'json',
  });

  if (!result) return null;

  let parsed: { recommendations: AIRecommendationItem[] };
  try {
    parsed = JSON.parse(result.text);
  } catch (err) {
    console.error('[recommendations] AI returned non-JSON:', result.text.slice(0, 200), err);
    return null;
  }

  const items: Recommendation[] = [];
  for (const r of parsed.recommendations ?? []) {
    const product = findProduct(r.slug);
    if (!product) continue;
    const because = typeof r.because === 'string' ? r.because.toUpperCase().slice(0, 60) : 'RECOMMENDED FOR YOU';
    items.push({ ...product, because });
    if (items.length === 3) break;
  }

  return items.length === 3 ? items : null;
}

const RECS_SYSTEM_PROMPT = `You recommend Wyze products for a logged-in user's smart home dashboard, based on their fleet and behavior.

TASK
Pick EXACTLY 3 products from the catalog that would benefit this user most. For each, write a short "because" line (UNDER 50 CHARACTERS, ALL CAPS) that ties the product to something specific in their profile — a camera they already own, a behavior pattern, a coverage gap. Be specific, not generic.

CONSTRAINTS
- Only pick slugs that exist in the catalog provided in the user message.
- NEVER recommend a slug listed under "ALREADY OWNED" — those are existing products.
- Spread categories where possible: don't pick three cameras when a lock or sensor would complete a setup better.

THE "because" LINE
This is the most important part. It MUST reference real data — a camera name, an event count, a specific behavior. NOT generic category descriptions. UNDER 50 CHARS. ALL CAPS.

GOOD (specific, references real data from the user's profile):
  ✓ "PAIRS WITH YOUR DOORBELL"      (when they own a doorbell of any kind)
  ✓ "73% OF BACKYARD AFTER DARK"    (cite a real metric from the profile)
  ✓ "COMPLETES YOUR FRONT-DOOR SETUP"
  ✓ "FOR ANGIE'S 47 NURSERY EVENTS" (use the actual camera name + count)
  ✓ "FOR THE 18 CLIPPED EVENTS"     (number must come from the profile)

BAD (generic OR fabricated):
  ✗ "WIRELESS OUTDOOR COVERAGE"           ← what makes it for THIS user?
  ✗ "INDOOR CAMERA UPGRADE"               ← upgrade FROM what?
  ✗ "GREAT ADDITION TO YOUR HOME"         ← marketing fluff
  ✗ "FOR YOUR CAM V3"                     ← DO NOT invent product models the user doesn't own
  ✗ Any reference to a camera model the user doesn't have in their fleet

ABSOLUTE RULE: Every camera name, model, number, and event-type in the because line MUST appear verbatim in the user's profile. If you can't write a specific because line using only data from the profile, pick a different product.

OUTPUT
A JSON object exactly in this shape (no prose, no markdown fences):
{
  "recommendations": [
    { "slug": "<catalog slug>", "because": "<UPPERCASE because line>" },
    { "slug": "<catalog slug>", "because": "<UPPERCASE because line>" },
    { "slug": "<catalog slug>", "because": "<UPPERCASE because line>" }
  ]
}`;

function buildRecsUserPrompt(home: Home): string {
  const cams = home.cameras
    .map((c) => {
      const tier = c.tier === 'free' ? 'NO PLAN' : 'Covered';
      return `- ${c.name} (${c.model}) — ${tier} — ${c.eventsThisWeek}/wk events. ${c.aiHighlight}`;
    })
    .join('\n');

  // Heuristic mapping from camera models the user already owns → catalog slugs
  // to avoid recommending. The AI tends to miss the "Drive Way (Floodlight Pro)" →
  // "don't pitch floodlight-pro" connection without this hint.
  const ownedSlugs = inferOwnedSlugs(home);

  return `USER: ${home.user.name} · ${home.user.location} · customer since ${home.user.customerSince} · last order ${home.user.lastOrderMonthsAgo}mo ago
PLAN: ${home.subs.planName}${home.subs.currentMonthly > 0 ? ` ($${home.subs.currentMonthly.toFixed(2)}/mo)` : ''}

FLEET (${home.cameras.length} cameras):
${cams}

ALREADY OWNED — DO NOT RECOMMEND THESE SLUGS:
${ownedSlugs.length > 0 ? ownedSlugs.map((s) => `- ${s}`).join('\n') : '- (none yet)'}

THIS WEEK: ${home.thisWeek.totalEvents} events · ${home.thisWeek.packages} packages · ${home.thisWeek.unfamiliarFaces} unfamiliar faces · ${home.thisWeek.babyCries} baby cry alerts

CATALOG (pick 3, by slug, from this list only):
${catalogForPrompt()}

Pick 3.`;
}

function inferOwnedSlugs(home: Home): string[] {
  const owned = new Set<string>();
  for (const c of home.cameras) {
    const m = c.model.toLowerCase();
    if (m.includes('floodlight')) owned.add('floodlight-pro');
    if (m.includes('doorbell pro')) owned.add('doorbell-pro');
    if (m.includes('pan v4')) owned.add('cam-pan-v4');
    if (m.includes('pan v3')) owned.add('cam-pan-v4'); // close enough — same product family
    if (m.includes('cam v4')) owned.add('cam-v4');
    if (m.includes('cam og')) owned.add('cam-og');
    if (m.includes('battery cam')) owned.add('battery-cam-pro');
    if (m.includes('window cam')) owned.add('window-cam');
  }
  return Array.from(owned);
}

// ============================================================================
// Per-user hardcoded fallbacks
// ============================================================================

function hardcodedRecommendations(home: Home): Recommendation[] {
  switch (home.user.id) {
    case 'owen':
      return pickBy([
        ['floodlight-pro', "FOR THE BACKYARD YOU DON'T COVER"],
        ['cam-v4', 'UPGRADE TO 2.5K FROM YOUR PAN V3'],
        ['climate-sensor', 'FOR THE LIVING ROOM'],
      ]);
    case 'bob':
      return pickBy([
        ['floodlight-pro', 'NO OUTDOOR LIGHTING YET'],
        ['climate-sensor', 'TEMP + HUMIDITY FOR THE BABY ROOM'],
        ['lock-bolt', 'PAIRS WITH YOUR DOORBELL PRO'],
      ]);
    case 'sunny':
    default:
      return pickBy([
        ['lock-bolt', 'COMPLETES YOUR FRONT DOOR'],
        ['climate-sensor', "FOR ANGIE'S NURSERY"],
        ['window-cam', 'A VIEW YOU DON\'T HAVE YET'],
      ]);
  }
}

function pickBy(specs: [string, string][]): Recommendation[] {
  const out: Recommendation[] = [];
  for (const [slug, because] of specs) {
    const p = findProduct(slug);
    if (p) out.push({ ...p, because });
  }
  // Belt-and-suspenders: if any slug is missing from the catalog, top up with the catalog head.
  while (out.length < 3) {
    const next = CATALOG.find((c) => !out.some((r) => r.slug === c.slug));
    if (!next) break;
    out.push({ ...next, because: 'RECOMMENDED FOR YOU' });
  }
  return out;
}
