import type { Home } from './types';
import { getCadenceFrame } from './cadence';

/**
 * The agent's proactive opening message — pre-typed for the user the moment
 * they land. Uses the same marker syntax as Claude responses so the existing
 * chat renderer handles it. The point: every piece of info in the OS comes
 * through one voice, including the briefing.
 */
export function buildAgentOpening(home: Home): string {
  const cadence = getCadenceFrame(home);
  const userName = home.user.name;
  const { windowEvents, windowMissedEvents, lastVisitLabel } = home.session;

  return `Welcome back, **${userName}**. ${cadence.subtitle}

I noticed three things worth your attention since ${lastVisitLabel.split(' at ')[0]}:

[CARD type="recommended"]
Title: Cover all 4 cameras for $9.99/mo
Price: Save $24/yr
Note: ${windowMissedEvents} of your Backyard's events were clipped short this week. Cam Unlimited covers all 4 for less than adding Cam Plus to Backyard, and unlocks AI Video Search.
[/CARD]

[CARD type="option"]
Title: Nursery alert at 3:14 AM Sunday
Note: You opened the app in 90 seconds. Cam Plus is doing its job there — no change needed.
[/CARD]

[CARD type="option"]
Title: 4 packages at Front Door this week
Note: Video Doorbell Pro pairs with your V3, adds two-way talk. 25% off this week for existing customers.
[/CARD]

What do you want to dig into?

[ACTION: Try Cam Unlimited free for 14 days]
[ACTION: Add Doorbell Pro to cart]
[ACTION: See the Backyard clips]`;
}

export const STARTING_CHIPS = [
  "What's the cheapest way to cover all 4?",
  'Which cam isn’t earning its keep?',
  'Should I add a doorbell?',
  'Compare Cam Plus and Cam Unlimited',
];
