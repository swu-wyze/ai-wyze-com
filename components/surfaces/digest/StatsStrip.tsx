import { getHome } from '@/lib/home-data';

interface StatProps {
  label: string;
  value: string | number;
  meta: React.ReactNode;
  metaTone?: 'default' | 'positive';
}

function Stat({ label, value, meta, metaTone = 'default' }: StatProps) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.05] rounded-[10px] p-4">
      <div className="text-[9px] font-semibold tracking-[1.5px] uppercase text-text-faint mb-2">{label}</div>
      <div className="text-[26px] font-semibold tracking-[-0.02em] tabular-nums leading-none mb-1.5">{value}</div>
      <div className={`text-[10px] ${metaTone === 'positive' ? 'text-wyze-green' : 'text-text-muted'}`}>{meta}</div>
    </div>
  );
}

export function StatsStrip() {
  const tw = getHome().thisWeek;
  return (
    <div className="grid grid-cols-4 gap-3 mb-8">
      <Stat label="Events" value={tw.totalEvents.toLocaleString()} meta={`↓ ${Math.abs(tw.eventsDelta)}% vs last week`} metaTone="positive" />
      <Stat label="Packages" value={tw.packages} meta="All retrieved" />
      <Stat label="Unfamiliar faces" value={tw.unfamiliarFaces} meta="Tue, Sat" />
      <Stat label="Baby cries" value={tw.babyCries} meta="Sun, 3:14 AM" />
    </div>
  );
}
