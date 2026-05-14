import { Sparkles, Info, WifiOff } from 'lucide-react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PageTitle } from '@/components/ui/PageTitle';
import { getCurrentHome } from '@/lib/home-data';

export default async function CamerasPage() {
  const home = await getCurrentHome();
  return (
    <div className="surface">
      <Eyebrow className="mb-2">CAMERAS · {home.cameras.length} IN YOUR HOME</Eyebrow>
      <PageTitle
        title="Your fleet, at a glance."
        subtitle="Each camera tile shows an AI summary of what mattered this week."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {home.cameras.map((cam) => {
          const isCamPlus = cam.tier === 'cam-plus';
          return (
            <div
              key={cam.id}
              className="bg-surface-1 rounded-[10px] overflow-hidden hover:bg-surface-2 transition-all"
            >
              {/* Preview */}
              <div className="relative h-[220px] overflow-hidden bg-gradient-to-br from-bg-elevated to-bg-sunken">
                {cam.online ? (
                  <>
                    {cam.previewSrc && (
                      <img
                        src={cam.previewSrc}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    {/* Top/bottom scrim so pills + AI strip read well over any image */}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 text-[9px] font-semibold tracking-[1px] uppercase px-2 py-1 rounded bg-black/55 text-white flex items-center gap-1.5 z-10">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      LIVE
                    </span>
                    <span
                      className={`absolute top-3 right-3 text-[9px] font-semibold tracking-[1px] uppercase px-2 py-1 rounded z-10 ${
                        isCamPlus ? 'bg-wyze-green/90 text-[#0a0a0a]' : 'bg-black/55 text-white/85'
                      }`}
                    >
                      {isCamPlus ? 'CAM PLUS' : 'NO PLAN'}
                    </span>
                    {/* Timestamp on the feed — sells the "this is live footage" idea */}
                    <span className="absolute bottom-3 right-3 text-[10px] tabular-nums font-medium text-white/85 bg-black/45 px-2 py-0.5 rounded z-10">
                      2026-05-13 · 14:13:50
                    </span>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-muted">
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
                  <div className="flex items-start justify-between gap-2 px-3 py-2 -mx-1 rounded bg-wyze-purple/[0.12] border border-accent-purple/20">
                    <div className="flex items-start gap-2">
                      <Info size={12} className="text-accent-purple shrink-0 mt-0.5" />
                      <span className="text-[11px] text-text-secondary leading-snug">{cam.aiHighlight}</span>
                    </div>
                    <a className="text-[11px] text-accent-purple font-medium shrink-0 hover:underline cursor-pointer whitespace-nowrap">
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
