// Adaptive cadence — the Digest hero reframes based on how long since the
// user's last visit. This is what makes the OS feel like it "knows you" rather
// than serving the same weekly recap to everyone, regardless of frequency.
//
// Branching, by gap since last visit:
//   < 6h    → "since you checked in" (same-session-ish)
//   6–12h   → "since this morning" (or "earlier today")
//   12–30h  → "since yesterday"
//   30–72h  → "since [weekday] [time]"   ← our default demo bucket (38h)
//   72–168h → "this week, since [date]"
//   ≥ 168h  → "since your last visit on [date]"  (welcome-back framing)

import type { Home } from './types';

export interface CadenceFrame {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Label that anchors the StatsStrip section below the hero. */
  statsSectionLabel: string;
}

type Bucket = 'same-session' | 'this-morning' | 'yesterday' | 'recent' | 'this-week' | 'gone-a-while';

function bucket(hours: number): Bucket {
  if (hours < 6) return 'same-session';
  if (hours < 12) return 'this-morning';
  if (hours < 30) return 'yesterday';
  if (hours < 72) return 'recent';
  if (hours < 168) return 'this-week';
  return 'gone-a-while';
}

export function getCadenceFrame(home: Home): CadenceFrame {
  const { lastVisitLabel, windowEvents, windowMissedEvents } = home.session;
  const b = bucket(home.session.lastVisitHoursAgo);
  const fleetCount = home.cameras.length;

  switch (b) {
    case 'same-session':
      return {
        eyebrow: `WELCOME BACK · LAST HERE A FEW HOURS AGO`,
        title: `Quiet stretch since you checked in.`,
        subtitle: `${windowEvents} event${windowEvents === 1 ? '' : 's'} captured — nothing urgent on top of what you saw earlier.`,
        statsSectionLabel: 'THIS WEEK',
      };

    case 'this-morning':
      return {
        eyebrow: `WELCOME BACK · LAST HERE EARLIER TODAY`,
        title: `Two things have happened since you checked this morning.`,
        subtitle: `${windowEvents} event${windowEvents === 1 ? '' : 's'} captured, ${windowMissedEvents} clipped short on free-tier cams.`,
        statsSectionLabel: 'THIS WEEK',
      };

    case 'yesterday':
      return {
        eyebrow: `WELCOME BACK · LAST HERE ${lastVisitLabel.toUpperCase()}`,
        title: `Since yesterday, three things stood out.`,
        subtitle: `${windowEvents} events captured · ${windowMissedEvents} were clipped short on your free-tier Backyard cam.`,
        statsSectionLabel: 'THIS WEEK',
      };

    case 'recent':
      return {
        eyebrow: `WELCOME BACK · LAST HERE ${lastVisitLabel.toUpperCase()}`,
        title: `Since ${lastVisitLabel.split(' at ')[0]}, three things are worth your attention.`,
        subtitle: `${windowEvents} events captured · ${windowMissedEvents} were clipped short on your free-tier Backyard cam — Cam Plus would've held the full clip.`,
        statsSectionLabel: 'THIS WEEK',
      };

    case 'this-week':
      return {
        eyebrow: `YOUR HOME · ${home.thisWeek.range.toUpperCase()}`,
        title: `A quiet week, with three things worth your attention.`,
        subtitle: `Your ${fleetCount} cameras captured ${home.thisWeek.totalEvents} events. Most were routine. Here's what stood out.`,
        statsSectionLabel: 'THIS WEEK',
      };

    case 'gone-a-while':
    default:
      return {
        eyebrow: `WELCOME BACK · LAST HERE ${lastVisitLabel.toUpperCase()}`,
        title: `Welcome back. Here's what your home has been up to.`,
        subtitle: `Your ${fleetCount} cameras captured ${home.thisWeek.totalEvents} events this week alone — and three patterns are worth a look.`,
        statsSectionLabel: 'THIS WEEK',
      };
  }
}
