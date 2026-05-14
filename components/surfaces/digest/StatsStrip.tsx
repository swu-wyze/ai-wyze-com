import { getCurrentHome } from '@/lib/home-data';

interface StatProps {
  label: string;
  value: string | number;
  meta: React.ReactNode;
  metaTone?: 'default' | 'positive';
}

/**
 * Compact bar-style row. Each cell pairs a tiny eyebrow with a tabular value
 * and a small meta line. Designed to sit as a thin status bar between the
 * Briefing and the FleetRibbon — not as a section of its own.
 */
function Stat({ label, value, meta, metaTone = 'default' }: StatProps) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="text-[9px] font-bold tracking-[1.3px] uppercase text-text-faint truncate">{label}</div>
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="text-[18px] font-semibold tabular-nums leading-none text-text-primary">{value}</span>
        <span
          className={`text-[10.5px] truncate ${metaTone === 'positive' ? 'text-accent-green' : 'text-text-muted'}`}
        >
          {meta}
        </span>
      </div>
    </div>
  );
}

export async function StatsStrip() {
  const tw = (await getCurrentHome()).thisWeek;
  const deltaArrow = tw.eventsDelta < 0 ? '↓' : '↑';
  const deltaPositive = tw.eventsDelta <= 0;
  return (
    // Open row, no boxes. A single faint top + bottom hairline gives the bar
    // its identity without carving the page into a grid.
    <div className="border-y border-faint py-4 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 md:gap-x-10">
      <Stat
        label="Events this week"
        value={tw.totalEvents.toLocaleString()}
        meta={`${deltaArrow} ${Math.abs(tw.eventsDelta)}% vs last week`}
        metaTone={deltaPositive ? 'positive' : 'default'}
      />
      <Stat label="Packages" value={tw.packages} meta={tw.packages > 0 ? 'All retrieved' : '—'} />
      <Stat label="Unfamiliar faces" value={tw.unfamiliarFaces} meta={tw.unfamiliarFaces > 0 ? 'Logged' : 'None'} />
      <Stat label="Baby cries" value={tw.babyCries} meta={tw.babyCries > 0 ? 'Sun, 3:14 AM' : 'None'} />
    </div>
  );
}
