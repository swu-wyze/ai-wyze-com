// The agent's proactive opening message — the briefing rendered in the chat
// rail the moment a user lands. Two paths:
//   1. AI-powered (preferred): asks the configured AI provider to produce a
//      tailored briefing using the user's profile + fleet + recent activity.
//   2. Hardcoded fallback: deterministic per-user text used when no AI key is
//      set or the call fails. Keeps the demo working offline.
//
// Result is cached in-memory by userId so the user doesn't re-pay the AI
// latency every time they navigate between surfaces in the same session.

import type { Home } from './types';
import { aiComplete, isAIConfigured } from './ai';

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min — invalidates if home data changes
const cache = new Map<string, { text: string; expiresAt: number }>();

export async function buildAgentOpening(home: Home): Promise<string> {
  const cached = cache.get(home.user.id);
  if (cached && cached.expiresAt > Date.now()) return cached.text;

  let text: string;
  if (isAIConfigured()) {
    const aiText = await generateOpening(home);
    text = aiText ?? hardcodedOpening(home);
  } else {
    text = hardcodedOpening(home);
  }

  cache.set(home.user.id, { text, expiresAt: Date.now() + CACHE_TTL_MS });
  return text;
}

/** AI-powered briefing. Returns null on failure → caller falls back. */
async function generateOpening(home: Home): Promise<string | null> {
  const result = await aiComplete({
    system: OPENING_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildOpeningUserPrompt(home) }],
    maxTokens: 700,
    temperature: 0.6,
  });
  if (!result || !result.text.trim()) return null;
  return result.text.trim();
}

const OPENING_SYSTEM_PROMPT = `You are the Wyze Home OS Intelligence — an AI woven into wyze.com that briefs a logged-in user on their smart home the moment they land.

TASK
Produce a short, opinionated opening message (the user has NOT asked anything yet). Greet them by name, summarize what's happened since their last visit, then surface 2–3 things that deserve their attention as inline cards. Offer 1–3 action buttons at the end.

VOICE
- Direct, brief, conversational. No marketing fluff.
- Reference specific cameras by name and quote real numbers from the profile.
- Be HONEST about cost. If the optimal answer for the user is NOT the most expensive plan, say so — trust beats upsell.
- Never mention "AI", "Claude", "LLM", "DeepSeek", or any model name.
- Don't apologize, hedge, or repeat the user's situation in a wind-up.

RENDERING MARKERS (use these exactly — the frontend parses them):
- **bold** and *italic* for inline emphasis
- [CARD type="recommended"]
  Title: <one-line title>
  Price: <optional price>
  Note: <one-line supporting copy>
  [/CARD]
  → green-wash card. Use ONE per message, for the top thing they should act on.
- [CARD type="option"]
  Title: <title>
  Note: <copy>
  [/CARD]
  → neutral card. For additional items worth noting.
- [BARS]
  Label A | $X/mo | 100 | false
  Label B | $Y/mo | 60  | true
  [/BARS]
  → bar comparison. Only use when comparing prices side-by-side. Highlight (true) the recommended row.
- [ACTION: Label] — action button at the end. Conventions: "Try [plan] free", "Add [product] to cart", "Move [plan] from [A] to [B]", "See [X]".

STRUCTURE (follow exactly)
1. ONE sentence greeting that names the user and quotes ONE specific number (events captured, missed, since when).
2. ONE short lead phrase ("Three things worth your attention since Sunday:" or similar).
3. 2–3 [CARD] blocks back-to-back. First is "recommended", others are "option". Each card's Title is under 60 chars, each Note is ONE sentence.
4. ONE short closing sentence asking what they want to do.
5. 1–3 [ACTION] markers, each on its own line.

HARD LIMITS
- Total prose (everything outside the marker blocks) must stay under 100 words.
- Total response under ~200 words including markers.
- No paragraphs longer than 2 sentences.

EXAMPLE OUTPUT (style and length to match — content will differ per user):

Welcome back, **Sunny**. Quiet stretch since Sunday — **52 events** across your fleet, zero clipped (Cam Unlimited has you fully covered).

Three things worth your attention:

[CARD type="recommended"]
Title: Upgrade to Cam Unlimited Pro for Angie's 3 AM alerts
Note: Pro adds 24/7 emergency dispatch + AI Video Search across your fleet for +$10/mo.
[/CARD]

[CARD type="option"]
Title: Drive Way Floodlight logged 36 events this week
Note: Saturday's FedEx reversal was held in full thanks to your existing plan.
[/CARD]

[CARD type="option"]
Title: 6 packages at Front Door, all retrieved
Note: A Lock Bolt would complete the front-door setup.
[/CARD]

What do you want to dig into?

[ACTION: Try Cam Unlimited Pro free for 14 days]
[ACTION: Add Lock Bolt to cart]
[ACTION: See Saturday's clip]`;

function buildOpeningUserPrompt(home: Home): string {
  const cams = home.cameras
    .map((c, i) => {
      const tier =
        c.tier === 'cam-plus' ? 'Covered (full clips, AI detection)' :
        'FREE TIER (12-second clips only)';
      const missed = c.missedEvents ? `, ~${c.missedEvents} events truncated` : '';
      return `${i + 1}. ${c.name} (${c.model}) — ${tier} — ${c.eventsThisWeek}/wk${missed}\n   Note: ${c.aiHighlight}`;
    })
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

PLAN CATALOG (use these EXACT prices and features — there is NO "Cam Plus Pro" plan)
- Cam Plus: $2.99/mo per camera. Full-length clips, 14-day history, person/package/vehicle/pet detection.
- Cam Unlimited: $9.99/mo for UNLIMITED cameras. Cam Plus features + multi-cam timeline + facial recognition.
- Cam Unlimited Pro: $19.99/mo for UNLIMITED cameras. Cam Unlimited + descriptive alerts + AI Video Search + 60-day history + 24/7 emergency dispatch. (AI Video Search and emergency dispatch are PRO-ONLY.)

Write the briefing now.`;
}

// ============================================================================
// Hardcoded per-user fallbacks (used when no AI key is set or AI errors).
// ============================================================================

function hardcodedOpening(home: Home): string {
  switch (home.user.id) {
    case 'owen':
      return owenOpening(home);
    case 'bob':
      return bobOpening(home);
    case 'sunny':
    default:
      return sunnyOpening(home);
  }
}

function owenOpening(home: Home): string {
  const { name } = home.user;
  const missed = home.session.windowMissedEvents;
  return `Welcome, **${name}**. Your home's been busier than the app can show — both of your cameras are on the free tier, and ${missed} of this week's events got clipped at 12 seconds.

Here's what stood out — and what we couldn't fully see:

[CARD type="recommended"]
Title: Try Cam Plus on your Front Door
Price: $2.99/mo · 14-day free trial
Note: Full-length clips, 14-day cloud history, package & person detection. Your 4 deliveries this week would be on a full clip instead of cut short.
[/CARD]

[CARD type="option"]
Title: Or cover both for $9.99/mo with Cam Unlimited
Note: Covers your Front Door and Living Room (and anything you add later). Includes AI Video Search.
[/CARD]

[CARD type="option"]
Title: Tuesday's unfamiliar face — Living Room
Note: A short clip caught someone, but the rest is gone. Cam Plus would've held the full event.
[/CARD]

Want me to start a Cam Plus trial?

[ACTION: Try 14 days free]
[ACTION: Compare Cam Plus and Cam Unlimited]
[ACTION: See the missed clips]`;
}

function bobOpening(home: Home): string {
  const { name } = home.user;
  const missed = home.session.windowMissedEvents;
  return `Welcome back, **${name}**. Front's been catching everything (Cam Plus is doing its job there) — but **Deck** and **Baby** are still on free clips. ${missed} events got cut short since Sunday.

Three things I'd flag:

[CARD type="recommended"]
Title: Cam Unlimited covers all 3 for $9.99/mo
Price: $1 more than adding Cam Plus to your two free cams
Note: Tuesday 2:14 AM, the Baby cam caught a cry but clipped at 12s. Cam Unlimited would've held the full alert and added AI Video Search.
[/CARD]

[CARD type="option"]
Title: Deck is your busiest cam — 47 events this week
Note: 18 of them clipped short. Likely the bird feeder, but worth seeing in full.
[/CARD]

[CARD type="option"]
Title: 6 packages at Front this week — all caught
Note: A doorbell upgrade pairs well if you ever go on vacation.
[/CARD]

What do you want to dig into?

[ACTION: Try Cam Unlimited free for 14 days]
[ACTION: Add Cam Plus to Baby and Deck]
[ACTION: See Baby's missed cry clip]`;
}

function sunnyOpening(home: Home): string {
  const { name } = home.user;
  const lastDay = home.session.lastVisitLabel.split(' at ')[0];
  return `Welcome back, **${name}**. Quiet stretch since ${lastDay} — **${home.session.windowEvents} events** across your fleet, nothing urgent, and zero clipped (Cam Unlimited has you fully covered).

Three things worth your attention:

[CARD type="recommended"]
Title: Upgrade to Cam Unlimited Pro for Angie's 3 AM alerts
Price: +$10/mo
Note: Pro adds 24/7 emergency dispatch and AI Video Search across your whole fleet — useful for the cam you check at 3am.
[/CARD]

[CARD type="option"]
Title: Drive Way Floodlight Pro: 36 events this week
Note: Including the FedEx truck reversing on Saturday — full clip held.
[/CARD]

[CARD type="option"]
Title: 6 packages at Front Door, all retrieved
Note: Lock Bolt would complete the front door setup — pairs with your Cam v3.
[/CARD]

What do you want to dig into?

[ACTION: Try Cam Unlimited Pro free for 14 days]
[ACTION: Add Lock Bolt to cart]
[ACTION: See Saturday's Drive Way clip]`;
}

// ============================================================================
// Suggestion chips (rendered when the chat thread has only the opening)
// ============================================================================

export function startingChipsFor(home: Home): string[] {
  switch (home.user.id) {
    case 'owen':
      return [
        "What's the cheapest way to cover both cameras?",
        'Show me everything I missed this week',
        'How does Cam Plus differ from Cam Unlimited?',
      ];
    case 'bob':
      return [
        "What's the cheapest way to cover all 3?",
        'Should I upgrade Baby to Cam Plus?',
        'Which cam isn’t earning its keep?',
      ];
    case 'sunny':
    default:
      return [
        'What did Angie see this week?',
        'Should I add a Lock Bolt?',
        'Should I upgrade to Cam Unlimited Pro?',
      ];
  }
}
