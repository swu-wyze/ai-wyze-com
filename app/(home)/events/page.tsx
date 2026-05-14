import { Package, Smile, Eye, Car, EyeOff, WifiOff, Volume2, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PageTitle } from '@/components/ui/PageTitle';
import { EVENTS, getHome } from '@/lib/home-data';

const ICON_MAP: Record<string, LucideIcon> = {
  Package, Smile, Eye, Car, EyeOff, WifiOff, Volume2, User,
};

function renderText(text: string) {
  // Tiny inline parser for the <strong>...</strong> our event data uses.
  const parts = text.split(/(<strong>.*?<\/strong>)/g);
  return parts.map((p, i) => {
    const m = p.match(/^<strong>(.*?)<\/strong>$/);
    if (m) return <strong key={i} className="font-semibold">{m[1]}</strong>;
    return <span key={i}>{p}</span>;
  });
}

export default function EventsPage() {
  const home = getHome();
  return (
    <div className="surface">
      <Eyebrow className="mb-2">EVENTS · YOUR HOME · {home.thisWeek.range.toUpperCase()}</Eyebrow>
      <PageTitle title={`${home.thisWeek.totalEvents} events this week.`} subtitle="AI-summarized timeline. Flagged events are worth a second look." />

      <div className="bg-hero-gradient border border-wyze-green/20 rounded-[14px] p-5 mb-6">
        <div className="text-[15px] font-semibold mb-1.5">Most of this week was uneventful — but three patterns stood out.</div>
        <div className="text-[12.5px] text-text-secondary leading-relaxed max-w-[720px]">
          Your Backyard hit its 12-second clip limit on 23 events — that&apos;s the loudest signal this week. Your
          Nursery saw normal activity except for one 3:14 AM cry alert. Front Door logged 4 package deliveries, all
          retrieved.
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['All', 'Flagged', 'Packages', 'People', 'Vehicles', 'Cut-short clips'].map((f, i) => (
          <button
            key={f}
            className={`text-[11px] px-3 py-1.5 rounded-full transition-all ${
              i === 0
                ? 'bg-wyze-green/15 text-wyze-green border border-wyze-green/30'
                : 'bg-white/[0.04] text-text-secondary border border-white/[0.06] hover:bg-white/[0.06]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {EVENTS.map((day) => (
        <div key={day.day} className="mb-7">
          <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-text-faint mb-3">{day.day}</div>
          <div className="rounded-[10px] border border-white/[0.05] overflow-hidden">
            {day.items.map((ev, i) => {
              const Icon = ICON_MAP[ev.icon] ?? Eye;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-4 py-3.5 ${
                    i > 0 ? 'border-t border-white/[0.04]' : ''
                  } ${ev.flagged ? 'bg-wyze-green/[0.04]' : 'bg-white/[0.02]'} hover:bg-white/[0.04] transition-all`}
                >
                  <div className="text-[11px] text-text-faint tabular-nums shrink-0 w-[58px]">{ev.time}</div>
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        ev.flagged ? 'bg-wyze-green/15' : 'bg-white/[0.05]'
                      }`}
                    >
                      <Icon size={14} className={ev.flagged ? 'text-wyze-green' : 'text-text-muted'} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] leading-snug">{renderText(ev.text)}</div>
                      <div className="text-[10.5px] text-text-faint mt-0.5">{ev.cam}</div>
                    </div>
                  </div>
                  <a className="text-[11px] text-text-muted hover:text-text-primary cursor-pointer shrink-0">View clip →</a>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
