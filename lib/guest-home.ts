// Pre-auth landing uses a stub Home so the ChatRail provider can mount
// without leaking another user's data. Zero plan, no cameras, neutral copy.

import type { Home, UserId } from './types';

export function getGuestHome(): Home {
  return {
    user: {
      id: 'guest' as UserId,
      name: 'there',
      initial: 'G',
      location: 'Setting up',
      customerSince: new Date().getFullYear(),
      lastOrderMonthsAgo: 0,
      propensityScore: 0,
    },
    cameras: [],
    subs: {
      currentMonthly: 0,
      currentAnnualEq: 0,
      planName: 'No plan',
    },
    thisWeek: {
      range: '',
      totalEvents: 0,
      packages: 0,
      unfamiliarFaces: 0,
      babyCries: 0,
      eventsDelta: 0,
    },
    session: {
      lastVisitHoursAgo: 0,
      lastVisitLabel: 'First visit',
      windowEvents: 0,
      windowMissedEvents: 0,
    },
    events: [],
  };
}

export const GUEST_OPENING_MESSAGE =
  "Hi! I'm Wyze Intelligence. Tell me what you're hoping to protect — a porch, a nursery, a backyard — and I'll build a setup that fits. Or pick a starting concern below.";
