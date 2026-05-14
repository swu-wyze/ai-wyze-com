// Scripted demo responses. Used as the graceful fallback when ANTHROPIC_API_KEY
// is not set, and as the regression test set when it is. Each response is
// returned as plain marker-text — the same shape Claude produces — so a single
// parser renders both paths.
//
// See docs/SCRIPTED_RESPONSES.md for the full demo brief.

interface ScriptEntry {
  matches: string[];
  text: string;
}

const SCRIPTS: ScriptEntry[] = [
  {
    matches: ['cheap', 'cheapest', 'lowest cost', 'save money', 'cover all'],
    text: `Cam Unlimited. **$9.99/mo**, covers all 4 — and it's actually cheaper than adding Cam Plus to Backyard.

[BARS]
Cam Plus × 4 | $11.96/mo | 100 | false
Cam Unlimited | $9.99/mo | 84 | true
[/BARS]

**Saves $24/year, plus AI Video Search and 60-day history.**

[ACTION: Try 14 days free]
[ACTION: See what changes]`,
  },
  {
    matches: ['earning', 'not earning', 'underused', 'least used', 'best value'],
    text: `Your **Living Room** cam.

It's on Cam Plus, but only saw 12 events this week — your Backyard saw 89 and isn't on any plan. You're paying $2.99/mo for a quiet cam while your busiest one runs on the free tier.

[CARD type="recommended"]
Title: Move Cam Plus → Backyard
Price: $0
Note: Same plan, 7× more events covered. No billing change.
[/CARD]

[ACTION: Move Cam Plus from Living Room to Backyard]
[ACTION: Show the math]`,
  },
  {
    matches: ['nursery', 'baby'],
    text: `Busy week. **47 events** total, the most of any of your cameras.

Highlights: one baby cry alert at **3:14 AM Sunday** — you opened the app within 90 seconds. Three "person detected" events (you, partner, you). Normal sleep pattern otherwise.

This cam earns its Cam Plus subscription.

[ACTION: See Nursery clips]`,
  },
  {
    matches: ['doorbell', 'video doorbell', 'should i add', 'should i buy'],
    text: `Yes.

Your Front Door V3 sees 4 packages a week, but doesn't know when someone's actually at the door. A doorbell adds two-way talk and porch-tuned motion zones — pairs with your V3, doesn't replace it.

[CARD type="option"]
Title: Video Doorbell Pro
Price: $89.98 (was $119.98, 25% off this week)
[/CARD]

[ACTION: Add Doorbell Pro to cart]
[ACTION: See product details]`,
  },
  {
    matches: ['compare', 'difference between', 'cam plus and cam unlimited', ' vs '],
    text: `For your fleet of 4, **Cam Unlimited wins on every axis except one**.

[CARD type="option"]
Title: Cam Plus × 4
Price: $11.96/mo
Note: 14-day cloud history. Person/Package/Vehicle/Pet detection. No AI Video Search.
[/CARD]

[CARD type="recommended"]
Title: Cam Unlimited
Price: $9.99/mo
Note: 60-day history. All Cam Plus AI. AI Video Search ("find a package on Tuesday"). Direct Emergency Dispatch.
[/CARD]

Cheaper *and* more. Only catch: it's $9.99/mo flat regardless of how many cameras you add, so if you ever drop to 1-2 cameras, Cam Plus becomes cheaper.

[ACTION: Try Cam Unlimited free for 14 days]`,
  },
];

const FALLBACK = `I can help with that, but for this demo I'm scripted to specific scenarios. Try one of:

*"What's the cheapest way to cover all 4?"* · *"Which cam isn't earning its keep?"* · *"Compare Cam Plus and Cam Unlimited"* · *"Should I add a doorbell?"* · *"What did my Nursery cam see?"*`;

export function matchScript(prompt: string): string {
  const lower = prompt.toLowerCase();
  for (const entry of SCRIPTS) {
    if (entry.matches.some((m) => lower.includes(m))) {
      return entry.text;
    }
  }
  return FALLBACK;
}

export const SUGGESTION_CHIPS = [
  "What's the cheapest way to cover all 4?",
  'Which cam isn’t earning its keep?',
  'Compare Cam Plus and Cam Unlimited',
  'Should I add a doorbell?',
  'What did my Nursery cam see?',
];
