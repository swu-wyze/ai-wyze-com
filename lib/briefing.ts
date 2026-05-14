// Briefing — a structured JSON snapshot the AI produces per-user, consumed by
// TWO surfaces from a single cache entry:
//   1. Digest page renders the greeting + subtitle + observation cards as a
//      prominent "what's happening" hero (anchored on the page, can't be
//      scrolled away).
//   2. Chat rail uses the same briefing to seed a minimal opening message —
//      just a "what do you want to do?" prompt plus the suggested action
//      buttons. The long-form context lives on the page, not in the chat.

import { aiComplete, isAIConfigured } from './ai';
import type { Home, UserId } from './types';

export interface BriefingCard {
  title: string;
  note: string;
  /** When true, this card gets the green-wash "recommended" treatment. Exactly one card should be flagged. */
  flagged?: boolean;
}

export interface Briefing {
  /** e.g. "Welcome back, Owen." — one short sentence. */
  greeting: string;
  /** Cadence-aware summary: "Since last Tuesday, 47 events rolled in…" */
  subtitle: string;
  /** Exactly 3 cards. The first / flagged one is the recommendation. */
  observations: BriefingCard[];
  /** 2–3 action buttons that show in the chat rail's opening message. */
  chatActions: string[];
}

const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map<UserId, { briefing: Briefing; expiresAt: number }>();

export async function getBriefing(home: Home): Promise<Briefing> {
  const cached = cache.get(home.user.id);
  if (cached && cached.expiresAt > Date.now()) return cached.briefing;

  let briefing: Briefing | null = null;
  if (isAIConfigured()) briefing = await generateBriefing(home);
  if (!briefing) briefing = hardcodedBriefing(home);

  cache.set(home.user.id, { briefing, expiresAt: Date.now() + CACHE_TTL_MS });
  return briefing;
}

/**
 * Formats the chat rail's opening message from the briefing. Intentionally
 * short — greeting + actions only. The long context is on the page.
 */
export function chatOpenerFromBriefing(briefing: Briefing, userName: string): string {
  const actions = briefing.chatActions.map((a) => `[ACTION: ${a}]`).join('\n');
  return `Hi, **${userName}**. What do you want to do?\n\n${actions}`;
}

async function generateBriefing(home: Home): Promise<Briefing | null> {
  const result = await aiComplete({
    system: BRIEFING_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildBriefingPrompt(home) }],
    maxTokens: 700,
    temperature: 0.5,
    responseFormat: 'json',
  });
  if (!result) return null;

  try {
    const parsed = JSON.parse(result.text) as Partial<Briefing>;
    if (
      typeof parsed.greeting !== 'string' ||
      typeof parsed.subtitle !== 'string' ||
      !Array.isArray(parsed.observations) ||
      !Array.isArray(parsed.chatActions)
    ) {
      return null;
    }
    const observations = parsed.observations.slice(0, 3).map((c) => ({
      title: String((c as BriefingCard).title ?? '').slice(0, 90),
      note: String((c as BriefingCard).note ?? '').slice(0, 200),
      flagged: (c as BriefingCard).flagged === true,
    }));
    // Enforce: exactly one flagged card. If none, flag the first.
    if (!observations.some((o) => o.flagged) && observations[0]) {
      observations[0].flagged = true;
    }
    const chatActions = parsed.chatActions.slice(0, 4).map((a) => String(a).slice(0, 60));
    return {
      greeting: parsed.greeting.slice(0, 80),
      subtitle: parsed.subtitle.slice(0, 250),
      observations,
      chatActions,
    };
  } catch (err) {
    console.error('[briefing] non-JSON AI output:', result.text.slice(0, 200), err);
    return null;
  }
}

const BRIEFING_SYSTEM_PROMPT = `You produce a structured briefing for a logged-in Wyze user, the moment they land on their dashboard. The briefing is split across two UI surfaces — a page section (greeting + cards) and a chat starter (actions only). You output ONE JSON object that powers both.

TASK
Read the user's fleet, plan, recent events, and weekly summary. Produce:
  1. A one-sentence greeting naming them by name.
  2. A one-sentence "since last visit" summary citing real numbers from the data.
  3. Exactly 3 short cards. Mix: one recommendation (flagged: true) + two observations (flagged: false) about what's actually happening in their home this week.
  4. 2-3 action button labels for the chat rail's opening.

WYZE PLANS (use EXACT names — there is NO "Cam Plus Pro" plan):
- Cam Plus: $2.99/mo per camera. Full clips + 14-day history + AI detection.
- Cam Unlimited: $9.99/mo unlimited cameras. Cam Plus features + facial recognition + multi-cam timeline.
- Cam Unlimited Pro: $19.99/mo unlimited cameras. Cam Unlimited + AI Video Search + 60-day history + 24/7 emergency dispatch. (AI Video Search and dispatch are PRO-ONLY.)

VOICE
- Direct, brief, conversational. No marketing fluff.
- Reference real data: camera names, event counts, behaviors. Never invent.
- Honest about cost. If the cheapest option fits the user, recommend that — don't push Pro on someone who doesn't need dispatch.

CARD RULES
- title: under 70 chars, plain language. Examples:
    "Try Cam Plus on your Front Door"
    "Living Room caught an unfamiliar face Tuesday"
    "Drive Way Floodlight logged 36 events this week"
- note: one sentence, under 160 chars. Cite real numbers / camera names / times.
- Exactly ONE card has flagged: true — the most actionable one (typically the plan pitch).
- Other two cards are pure observations: a pattern, an alert, a clipped event. Not pitches.

ACTION BUTTON RULES
- Use these patterns: "Try [plan] free for 30 days", "Add [product] to cart", "See [thing]", "Compare [A] and [B]", "Move [plan] from [A] to [B]".
- 2-3 actions. First is typically the recommended action that ties to the flagged card.

OUTPUT
A JSON object EXACTLY in this shape — no prose, no markdown fences:
{
  "greeting": "Welcome back, [Name].",
  "subtitle": "Since [day], [N] events rolled in across your [count] cameras — [signal].",
  "observations": [
    { "title": "...", "note": "...", "flagged": true },
    { "title": "...", "note": "..." },
    { "title": "...", "note": "..." }
  ],
  "chatActions": ["...", "...", "..."]
}`;

function buildBriefingPrompt(home: Home): string {
  const cams = home.cameras
    .map((c, i) => {
      const tier = c.tier === 'cam-plus' ? 'Covered (full clips, AI detection)' : 'FREE TIER (12-second clips only)';
      const missed = c.missedEvents ? `, ~${c.missedEvents} events truncated` : '';
      return `${i + 1}. ${c.name} (${c.model}) — ${tier} — ${c.eventsThisWeek}/wk${missed}\n   Note: ${c.aiHighlight}`;
    })
    .join('\n');

  const eventLines = home.events
    .flatMap((d) =>
      d.items.map((e) => `[${d.day.split(' · ')[0].slice(0, 3)}] ${e.time} · ${e.cam} · ${stripStrong(e.text)}${e.flagged ? '  [FLAGGED]' : ''}`)
    )
    .slice(0, 25)
    .join('\n');

  return `USER PROFILE
- Name: ${home.user.name}
- Location: ${home.user.location}
- Wyze customer since ${home.user.customerSince}
- Last order: ${home.user.lastOrderMonthsAgo} months ago

SUBSCRIPTION
- Plan: ${home.subs.planName}${home.subs.currentMonthly > 0 ? ` ($${home.subs.currentMonthly.toFixed(2)}/mo)` : ''}

CAMERA FLEET (${home.cameras.length} cameras)
${cams}

THIS WEEK (${home.thisWeek.range})
- ${home.thisWeek.totalEvents} total events (${home.thisWeek.eventsDelta > 0 ? '+' : ''}${home.thisWeek.eventsDelta}% vs last week)
- ${home.thisWeek.packages} package deliveries · ${home.thisWeek.unfamiliarFaces} unfamiliar faces · ${home.thisWeek.babyCries} baby cry alerts

SINCE LAST VISIT (${home.session.lastVisitLabel})
- ${home.session.windowEvents} events captured
- ${home.session.windowMissedEvents} clipped short on free-tier cameras

RECENT EVENTS (most recent first):
${eventLines}

Produce the briefing JSON now.`;
}

function stripStrong(s: string): string {
  return s.replace(/<\/?strong>/g, '');
}

// ============================================================================
// Per-user hardcoded fallbacks — used when no AI key is set or the AI errors.
// Same shape as the AI output so downstream rendering is uniform.
// ============================================================================

function hardcodedBriefing(home: Home): Briefing {
  switch (home.user.id) {
    case 'owen':
      return {
        greeting: `Welcome, ${home.user.name}.`,
        subtitle: `Since last Tuesday, ${home.session.windowEvents} events rolled in across your 2 cameras — ${home.session.windowMissedEvents} were clipped short because both are on the free tier.`,
        observations: [
          {
            title: 'Try Cam Plus on your Front Door',
            note: '$2.99/mo · full-length clips + 14-day history. Your 4 deliveries this week would arrive as complete clips instead of cut short.',
            flagged: true,
          },
          {
            title: 'Living Room caught an unfamiliar face Tuesday',
            note: "The full clip wasn't recorded — Cam Plus would have kept the whole event.",
          },
          {
            title: 'Or cover both for $9.99/mo with Cam Unlimited',
            note: 'Covers your Front Door and Living Room (and anything you add later).',
          },
        ],
        chatActions: ['Try Cam Plus free for 30 days', 'See the missed clips', 'Compare Cam Plus and Cam Unlimited'],
      };

    case 'bob':
      return {
        greeting: `Welcome back, ${home.user.name}.`,
        subtitle: `Front's catching everything (Cam Plus is doing its job), but Deck and Baby are still on free clips — ${home.session.windowMissedEvents} events got cut short since ${home.session.lastVisitLabel.split(' at ')[0]}.`,
        observations: [
          {
            title: 'Cam Unlimited covers all 3 for $9.99/mo',
            note: '$1 more than adding Cam Plus to your two free cams. Tuesday 2:14 AM, the Baby cam clipped during a cry alert.',
            flagged: true,
          },
          {
            title: 'Deck is your busiest cam — 47 events this week',
            note: '18 of them clipped short. Likely the bird feeder, but worth seeing in full.',
          },
          {
            title: '6 packages at Front this week — all caught',
            note: 'A doorbell upgrade pairs well if you ever go on vacation.',
          },
        ],
        chatActions: ['Try Cam Unlimited free for 30 days', 'Add Cam Plus to Baby and Deck', "See Baby's missed cry clip"],
      };

    case 'sunny':
    default:
      return {
        greeting: `Welcome back, ${home.user.name}.`,
        subtitle: `Quiet stretch since ${home.session.lastVisitLabel.split(' at ')[0]} — ${home.session.windowEvents} events across your fleet, nothing urgent, and zero clipped (Cam Unlimited has you fully covered).`,
        observations: [
          {
            title: "Upgrade to Cam Unlimited Pro for Angie's 3 AM alerts",
            note: '+$10/mo · 24/7 emergency dispatch + AI Video Search across your whole fleet. Useful for the cam you check at 3am.',
            flagged: true,
          },
          {
            title: 'Drive Way Floodlight logged 36 events this week',
            note: "Saturday's FedEx truck reversal was held in full thanks to your existing plan.",
          },
          {
            title: '6 packages at Front Door, all retrieved',
            note: 'A Lock Bolt would complete the front-door setup — pairs with your Cam v3.',
          },
        ],
        chatActions: ['Try Cam Unlimited Pro free for 30 days', 'Add Lock Bolt to cart', "See Saturday's clip"],
      };
  }
}
