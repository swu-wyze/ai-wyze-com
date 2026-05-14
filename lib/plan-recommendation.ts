// AI-powered plan recommendation — picks ONE plan as the best fit for the
// user's fleet, current plan, and recent events. Drives the "RECOMMENDED"
// tag on the Plans page simulator. Cached per user.

import { aiComplete, isAIConfigured } from './ai';
import type { Home, PlanId } from './types';

export interface PlanRecommendation {
  planId: PlanId;
  reason: string;
}

const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, { rec: PlanRecommendation; expiresAt: number }>();

export async function getPlanRecommendation(home: Home): Promise<PlanRecommendation> {
  const cached = cache.get(home.user.id);
  if (cached && cached.expiresAt > Date.now()) return cached.rec;

  let rec: PlanRecommendation | null = null;
  if (isAIConfigured()) rec = await generate(home);
  if (!rec) rec = hardcoded(home);

  cache.set(home.user.id, { rec, expiresAt: Date.now() + CACHE_TTL_MS });
  return rec;
}

async function generate(home: Home): Promise<PlanRecommendation | null> {
  const result = await aiComplete({
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt(home) }],
    maxTokens: 200,
    temperature: 0.3,
    responseFormat: 'json',
  });
  if (!result) return null;

  try {
    const parsed = JSON.parse(result.text);
    if (
      parsed.planId !== 'cam-plus' &&
      parsed.planId !== 'cam-unlimited' &&
      parsed.planId !== 'cam-unlimited-pro'
    ) {
      return null;
    }
    return {
      planId: parsed.planId,
      reason: String(parsed.reason ?? '').slice(0, 120),
    };
  } catch (err) {
    console.error('[plan-recommendation] non-JSON AI output:', result.text.slice(0, 200), err);
    return null;
  }
}

const SYSTEM_PROMPT = `You pick ONE Wyze subscription plan as the best fit for a logged-in user.

PLANS (use EXACT planId values — there is NO "cam-plus-pro"):
- cam-plus: $2.99/mo per camera. Full clips, 14-day history, person/package/vehicle/pet detection.
- cam-unlimited: $9.99/mo flat. Covers unlimited cameras. Cam Plus features + facial recognition + multi-cam timeline.
- cam-unlimited-pro: $19.99/mo flat. Cam Unlimited + AI Video Search + 60-day history + 24/7 emergency dispatch.

HEURISTICS
- 1–2 cameras, no special needs: cam-plus is cheapest and sufficient.
- 3 cameras: cam-unlimited often wins at +$1/mo over per-camera math AND adds features.
- 4+ cameras: cam-unlimited essentially always cheaper than per-camera Cam Plus.
- ANY user with baby-cry alerts, security incidents, or "checked at 3am" signals: consider cam-unlimited-pro for dispatch.
- Already on cam-unlimited with a safety-sensitive use case: recommend cam-unlimited-pro upgrade.
- Already on cam-unlimited-pro: recommend cam-unlimited-pro (stay).

HONESTY
- Don't push Pro on users who don't have a dispatch-relevant signal.
- Don't recommend a downgrade just because they could save money — only if the downgrade still meets their needs.

OUTPUT
A JSON object EXACTLY in this shape:
{
  "planId": "cam-plus" | "cam-unlimited" | "cam-unlimited-pro",
  "reason": "ONE sentence under 80 chars citing specific data (camera count, event pattern, etc.)"
}`;

function userPrompt(home: Home): string {
  return `USER: ${home.user.name} · ${home.user.location}
CURRENT PLAN: ${home.subs.planName}${home.subs.currentMonthly > 0 ? ` ($${home.subs.currentMonthly.toFixed(2)}/mo)` : ''}

FLEET (${home.cameras.length} cameras):
${home.cameras
  .map((c) => {
    const tier = c.tier === 'cam-plus' ? 'Covered' : 'FREE TIER';
    return `- ${c.name} (${c.model}) — ${tier} — ${c.eventsThisWeek}/wk events. ${c.aiHighlight}`;
  })
  .join('\n')}

THIS WEEK: ${home.thisWeek.totalEvents} events · ${home.thisWeek.packages} packages · ${home.thisWeek.babyCries} baby cry alerts · ${home.thisWeek.unfamiliarFaces} unfamiliar faces

Recommend ONE plan and explain why in one short sentence.`;
}

function hardcoded(home: Home): PlanRecommendation {
  const fleetSize = home.cameras.length;
  const camPlusTotal = 2.99 * fleetSize;
  const hasSafetySignal = home.thisWeek.babyCries > 0 || home.thisWeek.unfamiliarFaces > 0;
  const onUnlimitedAlready = /unlimited/i.test(home.subs.planName);

  // Sunny-like (already on Unlimited + safety signal) → upgrade to Pro
  if (onUnlimitedAlready && hasSafetySignal) {
    return {
      planId: 'cam-unlimited-pro',
      reason: '24/7 emergency dispatch for the cam you check at 3am.',
    };
  }

  // Already on Pro → stay
  if (/unlimited pro/i.test(home.subs.planName)) {
    return { planId: 'cam-unlimited-pro', reason: 'You already have the full feature set.' };
  }

  // Small fleet → cam-plus is cheapest
  if (fleetSize <= 2) {
    return {
      planId: 'cam-plus',
      reason: `Cheapest for ${fleetSize} cameras — $${camPlusTotal.toFixed(2)}/mo total.`,
    };
  }

  // 3+ cams: Cam Unlimited usually wins
  return {
    planId: 'cam-unlimited',
    reason: `$9.99/mo flat beats $${camPlusTotal.toFixed(2)}/mo per-camera AND adds features.`,
  };
}
