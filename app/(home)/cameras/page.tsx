import { Sparkles, Info, WifiOff } from 'lucide-react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PageTitle } from '@/components/ui/PageTitle';
import { getHome } from '@/lib/home-data';

export default function CamerasPage() {
  const home = getHome();
  return (
    <div className="surface">
      <Eyebrow className="mb-2">CAMERAS · {home.cameras.length} IN YOUR HOME</Eyebrow>
      <PageTitle
        title="Your fleet, at a glance."
        subtitle="Each camera tile shows an AI summary of what mattered this week."
      />

      <div className="grid grid-cols-2 gap-3">
        {home.cameras.map((cam) => {
          const isCamPlus = cam.tier === 'cam-plus';
          return (
            <div
              key={cam.id}
              className="bg-white/[0.03] border border-white/[0.05] rounded-[10px] overflow-hidden hover:bg-white/[0.04] transition-all"
            >
              {/* Preview placeholder */}
              <div className="relative h-[170px] bg-gradient-to-br from-bg-elevated to-bg-sunken border-b border-white/[0.04] flex items-center justify-center">
                {cam.online ? (
                  <>
                    <span className="absolute top-3 left-3 text-[9px] font-semibold tracking-[1px] uppercase px-2 py-1 rounded bg-red-400/15 text-red-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      LIVE
                    </span>
                    <span
                      className={`absolute top-3 right-3 text-[9px] font-semibold tracking-[1px] uppercase px-2 py-1 rounded ${
                        isCamPlus ? 'bg-wyze-green/15 text-wyze-green' : 'bg-white/[0.06] text-text-faint'
                      }`}
                    >
                      {isCamPlus ? 'CAM PLUS' : 'NO PLAN'}
                    </span>
                    <div className="text-[10px] text-text-faint tracking-[1.5px] uppercase">Feed preview</div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-text-muted">
                    <WifiOff size={24} />
                    <div className="text-[11px]">Camera offline</div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-baseline justify-between mb-0.5">
                  <div className="text-[14px] font-semibold">{cam.name}</div>
                  <div className="text-[10px] text-text-faint tabular-nums">{cam.eventsThisWeek}/wk</div>
                </div>
                <div className="text-[11px] text-text-muted mb-3">{cam.model}</div>

                {isCamPlus ? (
                  <div className="flex items-start gap-2 px-3 py-2 -mx-1 rounded bg-wyze-green/[0.08] border border-wyze-green/15">
                    <Sparkles size={12} className="text-wyze-green shrink-0 mt-0.5" />
                    <span className="text-[11px] text-text-secondary leading-snug">{cam.aiHighlight}</span>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2 px-3 py-2 -mx-1 rounded bg-wyze-purple/[0.12] border border-wyze-purple-light/20">
                    <div className="flex items-start gap-2">
                      <Info size={12} className="text-wyze-purple-light shrink-0 mt-0.5" />
                      <span className="text-[11px] text-text-secondary leading-snug">{cam.aiHighlight}</span>
                    </div>
                    <a className="text-[11px] text-wyze-purple-light font-medium shrink-0 hover:underline cursor-pointer whitespace-nowrap">
                      Cover this →
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
