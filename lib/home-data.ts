// Sunny's home — the single source of truth for the demo persona.
// All surfaces and the chat system prompt read from this.
//
// Stage A: hard-coded.
// Stage B: replace with `async function getHome(userId): Promise<Home>` that
// hits Wyze internal services. Keep the shape stable so this is a swap, not a rewrite.

import type { Home, EventDay } from './types';

export const HOME: Home = {
  user: {
    name: 'Sunny',
    initial: 'S',
    location: 'Kirkland, WA',
    customerSince: 2023,
    lastOrderMonthsAgo: 8,
    propensityScore: 0.73,
  },

  cameras: [
    {
      id: 'front-door',
      name: 'Front Door',
      model: 'Wyze Cam v3',
      tier: 'cam-plus',
      online: true,
      eventsThisWeek: 14,
      eventsToday: 2,
      aiHighlight: '4 packages this week — all retrieved.',
    },
    {
      id: 'nursery',
      name: 'Nursery',
      model: 'Wyze Cam Pan v3',
      tier: 'cam-plus',
      online: true,
      eventsThisWeek: 47,
      eventsToday: 8,
      aiHighlight: 'Baby cry alert at 3:14 AM Sunday — you opened in 90s.',
    },
    {
      id: 'living-room',
      name: 'Living Room',
      model: 'Wyze Cam Pan v3',
      tier: 'cam-plus',
      online: true,
      eventsThisWeek: 12,
      eventsToday: 0,
      aiHighlight: 'Lowest activity this week — could move Cam Plus to Backyard.',
    },
    {
      id: 'backyard',
      name: 'Backyard',
      model: 'Wyze Cam OG Outdoor',
      tier: 'free',
      online: true,
      eventsThisWeek: 89,
      eventsToday: 11,
      missedEvents: 23,
      aiHighlight: '73% of events happen after dark. Floodlight Pro pairs well.',
    },
  ],

  subs: {
    currentMonthly: 8.97,
    currentAnnualEq: 107.64,
  },

  thisWeek: {
    range: 'May 6 – May 13',
    totalEvents: 162,
    packages: 4,
    unfamiliarFaces: 2,
    babyCries: 1,
    eventsDelta: -12,
  },

  // Adaptive cadence — change `lastVisitHoursAgo` to see how the Digest hero
  // reframes (under 12 → "since this morning", under 30 → "since yesterday",
  // under 72 → "since [weekday]", under 168 → "this week", more → "since
  // your last visit on …").
  session: {
    lastVisitHoursAgo: 38,
    lastVisitLabel: 'Sunday at 9:48 PM',
    windowEvents: 38,
    windowMissedEvents: 11,
  },
};

// Stage B: replace with getHome(userId)
export function getHome(): Home {
  return HOME;
}

export const EVENTS: EventDay[] = [
  {
    day: 'TODAY · TUESDAY MAY 13',
    items: [
      { time: '2:14 PM', cam: 'Front Door', icon: 'Package', text: '<strong>Package delivered.</strong> USPS, left on porch.', flagged: false },
      { time: '11:42 AM', cam: 'Nursery', icon: 'Smile', text: 'Person detected — baby waking up.', flagged: false },
      { time: '9:08 AM', cam: 'Backyard', icon: 'Eye', text: 'Motion — <strong>clip cut short (12s limit)</strong>.', flagged: true },
    ],
  },
  {
    day: 'MONDAY MAY 12',
    items: [
      { time: '11:42 PM', cam: 'Backyard', icon: 'EyeOff', text: 'Motion — <strong>Cam Plus would have caught the rest</strong>.', flagged: true },
      { time: '7:24 PM', cam: 'Front Door', icon: 'Car', text: 'Vehicle detected in driveway.', flagged: false },
      { time: '3:08 PM', cam: 'Living Room', icon: 'User', text: 'Person detected — partner came home.', flagged: false },
    ],
  },
  {
    day: 'SUNDAY MAY 11',
    items: [
      { time: '3:14 AM', cam: 'Nursery', icon: 'Volume2', text: '<strong>Baby cry detected.</strong> You opened the app within 90 seconds.', flagged: true },
      { time: '10:32 AM', cam: 'Front Door', icon: 'User', text: 'Unfamiliar face detected.', flagged: false },
      { time: '8:14 AM', cam: 'Front Door', icon: 'Package', text: 'Package delivered.', flagged: false },
    ],
  },
];
