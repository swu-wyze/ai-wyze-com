import { getCurrentHome } from '@/lib/home-data';

interface StatProps {
  label: string;
  value: string | number;
  meta: React.ReactNode;
  metaTone?: 'default' | 'positive';
}

function Stat({ label, value, meta, metaTone = 'default' }: StatProps) {
  return (
    <div className="bg-surface-1 border border-faint rounded-xl p-5">
      <div className="text-[10px] font-medium tracking-[1.2px] uppercase text-text-muted mb-2">{label}</div>
      <div className="text-[30px] font-medium tracking-[-0.02em] tabular-nums leading-none mb-2.5 text-text-primary">
        {value}
      </div>
      <div className={`text-[11px] ${metaTone === 'positive' ? 'text-wyze-green' : 'text-text-faint'}`}>{meta}</div>
    </div>
  );
}

export async function StatsStrip() {
  const tw = (await getCurrentHome()).thisWeek;
  const deltaArrow = tw.eventsDelta < 0 ? '↓' : '↑';
  const deltaPositive = tw.eventsDelta <= 0; // fewer events = positive
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <Stat
        label="Events"
        value={tw.totalEvents.toLocaleString()}
        meta={`${deltaArrow} ${Math.abs(tw.eventsDelta)}% vs last week`}
        metaTone={deltaPositive ? 'positive' : 'default'}
      />
      <Stat label="Packages" value={tw.packages} meta={tw.packages > 0 ? 'All retrieved' : '—'} />
      <Stat label="Unfamiliar faces" value={tw.unfamiliarFaces} meta={tw.unfamiliarFaces > 0 ? 'This week' : 'None'} />
      <Stat label="Baby cries" value={tw.babyCries} meta={tw.babyCries > 0 ? 'Sun, 3:14 AM' : 'None'} />
    </div>
  );
}
