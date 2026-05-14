// Three demo personas. Each is a fully-specified Home that drives every
// surface, the agent rail, and the chat system prompt. Username == UserId.
//
// Stage A: hard-coded here.
// Stage B: replace with `async function getHome(userId): Promise<Home>` that
// hits Wyze internal services.

import type { Home, UserId } from './types';

const SCENES = {
  porch: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=640&h=360&fit=crop&auto=format',
  nursery: 'https://images.unsplash.com/photo-1543346242-2b8e41fb91ca?w=640&h=360&fit=crop&auto=format',
  livingRoom: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=640&h=360&fit=crop&auto=format',
  backyard: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=640&h=360&fit=crop&auto=format',
  deck: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=640&h=360&fit=crop&auto=format',
  hallway: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=640&h=360&fit=crop&auto=format',
  driveway: 'https://images.unsplash.com/photo-1604882234072-d5741489e0c0?w=640&h=360&fit=crop&auto=format',
};

/**
 * Owen — 2 cameras, no subscription. The "what am I missing?" persona.
 * Everything's on free tier; loss-aversion pitch is strongest here.
 */
const OWEN: Home = {
  user: {
    id: 'owen',
    name: 'Owen',
    initial: 'O',
    location: 'Bellevue, WA',
    customerSince: 2024,
    lastOrderMonthsAgo: 11,
    propensityScore: 0.42,
  },
  cameras: [
    {
      id: 'front-door',
      name: 'Front Door',
      model: 'Wyze Video Doorbell v2',
      tier: 'free',
      online: true,
      eventsThisWeek: 28,
      eventsToday: 4,
      missedEvents: 16,
      aiHighlight: '4 packages this week — 3 of them clipped short.',
      previewSrc: SCENES.porch,
    },
    {
      id: 'living-room',
      name: 'Living Room',
      model: 'Wyze Cam Pan v3',
      tier: 'free',
      online: true,
      eventsThisWeek: 19,
      eventsToday: 2,
      missedEvents: 9,
      aiHighlight: 'Unfamiliar face Tuesday — full clip not recorded.',
      previewSrc: SCENES.livingRoom,
    },
  ],
  subs: {
    currentMonthly: 0,
    currentAnnualEq: 0,
    planName: 'No plan',
  },
  thisWeek: {
    range: 'May 6 – May 13',
    totalEvents: 47,
    packages: 4,
    unfamiliarFaces: 1,
    babyCries: 0,
    eventsDelta: 8,
  },
  session: {
    lastVisitHoursAgo: 168,
    lastVisitLabel: 'last Tuesday',
    windowEvents: 47,
    windowMissedEvents: 25,
  },
  events: [
    {
      day: 'TODAY · TUESDAY MAY 13',
      items: [
        { time: '2:14 PM', cam: 'Front Door', icon: 'Package', text: '<strong>Package delivered</strong> — Amazon, <strong>clipped at 12s</strong>.', flagged: true },
        { time: '11:08 AM', cam: 'Living Room', icon: 'User', text: 'Person detected — short clip only.', flagged: true },
        { time: '8:42 AM', cam: 'Front Door', icon: 'User', text: 'Person at door — knocked twice, walked away.', flagged: false },
      ],
    },
    {
      day: 'MONDAY MAY 12',
      items: [
        { time: '7:18 PM', cam: 'Front Door', icon: 'Car', text: 'Vehicle pulled in — clipped before driver got out.', flagged: true },
        { time: '4:42 PM', cam: 'Front Door', icon: 'Package', text: '<strong>Package delivered</strong> — USPS.', flagged: false },
        { time: '10:18 AM', cam: 'Living Room', icon: 'User', text: '<strong>Unfamiliar face</strong> — clip cut short, never saw who.', flagged: true },
      ],
    },
    {
      day: 'SUNDAY MAY 11',
      items: [
        { time: '6:48 PM', cam: 'Living Room', icon: 'User', text: 'Person — couldn\'t tell who, free clip ran out.', flagged: true },
        { time: '3:22 PM', cam: 'Front Door', icon: 'Car', text: 'Vehicle in driveway.', flagged: false },
        { time: '9:08 AM', cam: 'Front Door', icon: 'Package', text: '<strong>Package delivered</strong> — <strong>clipped at 12s</strong>.', flagged: true },
      ],
    },
    {
      day: 'SATURDAY MAY 10',
      items: [
        { time: '11:14 PM', cam: 'Living Room', icon: 'EyeOff', text: 'Motion at night — clipped.', flagged: true },
        { time: '2:28 PM', cam: 'Front Door', icon: 'Package', text: '<strong>Package delivered</strong>.', flagged: false },
      ],
    },
    {
      day: 'FRIDAY MAY 9',
      items: [
        { time: '5:12 PM', cam: 'Front Door', icon: 'User', text: 'Stranger lingered near door — <strong>only 12s captured</strong>.', flagged: true },
        { time: '12:04 PM', cam: 'Living Room', icon: 'Eye', text: 'Motion — pet probably.', flagged: false },
      ],
    },
  ],
};

/**
 * Bob — 3 cameras, 1 Cam Plus (on Front). The "extend coverage" persona.
 * Mixed state: one premium camera, two free. Strong case for Cam Unlimited.
 */
const BOB: Home = {
  user: {
    id: 'bob',
    name: 'Bob',
    initial: 'B',
    location: 'Seattle, WA',
    customerSince: 2024,
    lastOrderMonthsAgo: 4,
    propensityScore: 0.65,
  },
  cameras: [
    {
      id: 'front',
      name: 'Front',
      model: 'Wyze Video Doorbell Pro',
      tier: 'cam-plus',
      online: true,
      eventsThisWeek: 32,
      eventsToday: 5,
      aiHighlight: '6 packages this week — all caught on full clip.',
      previewSrc: SCENES.porch,
    },
    {
      id: 'deck',
      name: 'Deck',
      model: 'Wyze Cam v4',
      tier: 'free',
      online: true,
      eventsThisWeek: 47,
      eventsToday: 8,
      missedEvents: 18,
      aiHighlight: '18 clip-cut events this week — busy bird feeder.',
      previewSrc: SCENES.deck,
    },
    {
      id: 'baby',
      name: 'Baby',
      model: 'Wyze Cam v4',
      tier: 'free',
      online: true,
      eventsThisWeek: 51,
      eventsToday: 9,
      missedEvents: 22,
      aiHighlight: 'Baby cry Tuesday 2:14 AM — clip cut at 12s.',
      previewSrc: SCENES.nursery,
    },
  ],
  subs: {
    currentMonthly: 2.99,
    currentAnnualEq: 35.88,
    planName: 'Cam Plus × 1',
  },
  thisWeek: {
    range: 'May 6 – May 13',
    totalEvents: 130,
    packages: 6,
    unfamiliarFaces: 1,
    babyCries: 3,
    eventsDelta: -8,
  },
  session: {
    lastVisitHoursAgo: 36,
    lastVisitLabel: 'Sunday at 8:14 PM',
    windowEvents: 42,
    windowMissedEvents: 14,
  },
  events: [
    {
      day: 'TODAY · TUESDAY MAY 13',
      items: [
        { time: '2:14 PM', cam: 'Front', icon: 'Package', text: '<strong>Package delivered.</strong> USPS, full clip.', flagged: false },
        { time: '11:42 AM', cam: 'Baby', icon: 'Smile', text: 'Person detected — baby waking.', flagged: false },
        { time: '9:08 AM', cam: 'Deck', icon: 'Eye', text: 'Motion — <strong>clip cut short (12s limit)</strong>.', flagged: true },
        { time: '6:50 AM', cam: 'Deck', icon: 'Eye', text: 'Motion at bird feeder — <strong>clipped</strong>.', flagged: true },
      ],
    },
    {
      day: 'MONDAY MAY 12',
      items: [
        { time: '7:24 PM', cam: 'Front', icon: 'Car', text: 'Vehicle pulled in — partner home from work.', flagged: false },
        { time: '4:12 PM', cam: 'Front', icon: 'Package', text: '<strong>Package delivered</strong> — UPS.', flagged: false },
        { time: '6:12 AM', cam: 'Deck', icon: 'EyeOff', text: 'Motion at dawn — <strong>clip cut short</strong>.', flagged: true },
      ],
    },
    {
      day: 'SUNDAY MAY 11',
      items: [
        { time: '11:18 PM', cam: 'Baby', icon: 'Volume2', text: 'Baby cry — quick check, fell back asleep.', flagged: false },
        { time: '2:14 AM', cam: 'Baby', icon: 'Volume2', text: '<strong>Baby cry detected</strong> at 2:14 AM — <strong>clipped at 12s</strong>, never saw the full event.', flagged: true },
        { time: '8:14 AM', cam: 'Front', icon: 'Package', text: 'Package delivered.', flagged: false },
      ],
    },
    {
      day: 'SATURDAY MAY 10',
      items: [
        { time: '8:32 PM', cam: 'Deck', icon: 'Eye', text: 'Racoons at bird feeder — <strong>clipped multiple times</strong>.', flagged: true },
        { time: '3:14 PM', cam: 'Front', icon: 'Package', text: '<strong>Package delivered</strong>.', flagged: false },
        { time: '12:48 AM', cam: 'Baby', icon: 'Volume2', text: 'Baby cry — clip cut short.', flagged: true },
      ],
    },
    {
      day: 'FRIDAY MAY 9',
      items: [
        { time: '9:42 PM', cam: 'Deck', icon: 'Eye', text: 'Motion outside — <strong>clipped</strong>.', flagged: true },
        { time: '5:22 PM', cam: 'Front', icon: 'User', text: 'Visitor at front door — full clip.', flagged: false },
        { time: '2:42 AM', cam: 'Baby', icon: 'Volume2', text: 'Baby cry — clip cut short again.', flagged: true },
      ],
    },
  ],
};

/**
 * Sunny — 5 cameras, Cam Unlimited. The "fully covered, what's next?" persona.
 * No conversion pitch needed. Agent shifts to maintenance + add-on hardware.
 */
const SUNNY: Home = {
  user: {
    id: 'sunny',
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
      eventsThisWeek: 22,
      eventsToday: 3,
      aiHighlight: '6 packages this week — all retrieved.',
      previewSrc: SCENES.porch,
    },
    {
      id: 'backyard',
      name: 'Backyard',
      model: 'Wyze Cam OG Outdoor',
      tier: 'cam-plus',
      online: true,
      eventsThisWeek: 89,
      eventsToday: 11,
      aiHighlight: '73% of events happen after dark.',
      previewSrc: SCENES.backyard,
    },
    {
      id: 'hallway',
      name: 'Hallway',
      model: 'Wyze Cam Pan v3',
      tier: 'cam-plus',
      online: true,
      eventsThisWeek: 18,
      eventsToday: 2,
      aiHighlight: 'Mostly the dog this week.',
      previewSrc: SCENES.hallway,
    },
    {
      id: 'angie',
      name: 'Angie',
      model: 'Wyze Cam Pan v3',
      tier: 'cam-plus',
      online: true,
      eventsThisWeek: 47,
      eventsToday: 8,
      aiHighlight: 'Baby cry alert 3:14 AM Sunday — opened in 90s.',
      previewSrc: SCENES.nursery,
    },
    {
      id: 'driveway',
      name: 'Drive Way',
      model: 'Wyze Cam Floodlight Pro',
      tier: 'cam-plus',
      online: true,
      eventsThisWeek: 36,
      eventsToday: 4,
      aiHighlight: 'Delivery truck reversed Saturday — full clip held.',
      previewSrc: SCENES.driveway,
    },
  ],
  subs: {
    currentMonthly: 9.99,
    currentAnnualEq: 99.99,
    planName: 'Cam Unlimited',
  },
  thisWeek: {
    range: 'May 6 – May 13',
    totalEvents: 212,
    packages: 6,
    unfamiliarFaces: 2,
    babyCries: 1,
    eventsDelta: -9,
  },
  session: {
    lastVisitHoursAgo: 38,
    lastVisitLabel: 'Sunday at 9:48 PM',
    windowEvents: 52,
    windowMissedEvents: 0,
  },
  events: [
    {
      day: 'TODAY · TUESDAY MAY 13',
      items: [
        { time: '2:14 PM', cam: 'Front Door', icon: 'Package', text: '<strong>Package delivered.</strong> USPS, left on porch.', flagged: false },
        { time: '11:42 AM', cam: 'Angie', icon: 'Smile', text: 'Person detected — baby waking up.', flagged: false },
        { time: '9:08 AM', cam: 'Backyard', icon: 'Eye', text: 'Motion — coyote crossed the yard.', flagged: false },
      ],
    },
    {
      day: 'MONDAY MAY 12',
      items: [
        { time: '7:24 PM', cam: 'Drive Way', icon: 'Car', text: 'Vehicle pulled in — floodlight triggered, full clip.', flagged: false },
        { time: '4:18 PM', cam: 'Front Door', icon: 'Package', text: '<strong>Package delivered</strong> — FedEx.', flagged: false },
        { time: '3:08 PM', cam: 'Hallway', icon: 'User', text: 'Person — partner came home.', flagged: false },
        { time: '7:42 AM', cam: 'Angie', icon: 'Smile', text: 'Baby waking — normal morning.', flagged: false },
      ],
    },
    {
      day: 'SUNDAY MAY 11',
      items: [
        { time: '10:32 AM', cam: 'Front Door', icon: 'User', text: 'Unfamiliar face detected — neighbor visiting.', flagged: false },
        { time: '8:14 AM', cam: 'Front Door', icon: 'Package', text: 'Package delivered.', flagged: false },
        { time: '3:14 AM', cam: 'Angie', icon: 'Volume2', text: '<strong>Baby cry detected at 3:14 AM</strong> — full 90-second clip held. You opened the app inside 90s.', flagged: true },
      ],
    },
    {
      day: 'SATURDAY MAY 10',
      items: [
        { time: '5:48 PM', cam: 'Drive Way', icon: 'Car', text: '<strong>FedEx truck reversed</strong> in driveway — Floodlight Pro caught the full event.', flagged: true },
        { time: '11:18 AM', cam: 'Backyard', icon: 'Eye', text: 'Deer in yard — full clip.', flagged: false },
        { time: '8:02 AM', cam: 'Front Door', icon: 'Package', text: 'Package delivered.', flagged: false },
      ],
    },
    {
      day: 'FRIDAY MAY 9',
      items: [
        { time: '11:08 PM', cam: 'Backyard', icon: 'Eye', text: 'Raccoon at trash bin — full clip.', flagged: false },
        { time: '9:14 PM', cam: 'Hallway', icon: 'User', text: 'Dog wandered through — quiet evening.', flagged: false },
        { time: '2:28 AM', cam: 'Angie', icon: 'Volume2', text: 'Baby cry — settled in under 60s.', flagged: false },
      ],
    },
  ],
};

export const HOMES: Record<UserId, Home> = {
  owen: OWEN,
  bob: BOB,
  sunny: SUNNY,
};

/** Username → password. Hardcoded. Demo only. */
export const USER_CREDENTIALS: Record<UserId, string> = {
  owen: '123456',
  bob: '123456',
  sunny: '123456',
};

export const USER_IDS: UserId[] = ['owen', 'bob', 'sunny'];

export function getHomeFor(userId: UserId): Home {
  return HOMES[userId];
}

export function isValidUserId(s: string): s is UserId {
  return s === 'owen' || s === 'bob' || s === 'sunny';
}
