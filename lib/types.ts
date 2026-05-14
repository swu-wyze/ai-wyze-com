// All TypeScript types for the Wyze Home OS.
// Stage A: hard-coded data. Stage B: same shapes, async fetchers.

export type CameraTier = 'free' | 'cam-plus' | 'cam-plus-pro';

export interface Camera {
  id: string;
  name: string;
  model: string;
  tier: CameraTier;
  online: boolean;
  eventsThisWeek: number;
  eventsToday: number;
  missedEvents?: number;
  aiHighlight: string;
}

export interface User {
  name: string;
  initial: string;
  location: string;
  customerSince: number;
  lastOrderMonthsAgo: number;
  propensityScore: number;
}

export interface WeekSummary {
  range: string;
  totalEvents: number;
  packages: number;
  unfamiliarFaces: number;
  babyCries: number;
  eventsDelta: number;
}

export interface SessionContext {
  // Hours since the user's previous visit to this app. Drives the adaptive
  // cadence on Digest — we reframe the narrative around the gap rather than
  // a hardcoded weekly window. Stage B: derive from auth session.
  lastVisitHoursAgo: number;
  // Human-readable form of the last-visit moment (e.g. "Sunday at 9:48 PM").
  lastVisitLabel: string;
  // Events captured since the last visit (subset of thisWeek.totalEvents).
  windowEvents: number;
  // Events truncated by free-tier 12s limit since last visit (conversion ammo).
  windowMissedEvents: number;
}

export interface Home {
  user: User;
  cameras: Camera[];
  subs: {
    currentMonthly: number;
    currentAnnualEq: number;
  };
  thisWeek: WeekSummary;
  session: SessionContext;
}

export type PlanId = 'cam-plus' | 'cam-plus-pro' | 'cam-unlimited' | 'cam-unlimited-pro';

export interface Plan {
  id: PlanId;
  name: string;
  monthly: number;
  annual: number;
  features: string[];
}

export interface EventItem {
  time: string;
  cam: string;
  icon: string;
  text: string;
  flagged: boolean;
}

export interface EventDay {
  day: string;
  items: EventItem[];
}

// Chat types
export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatAction {
  label: string;
  type?: string;
  payload?: Record<string, unknown>;
}
