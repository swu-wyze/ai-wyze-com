import { Video, WifiOff } from 'lucide-react';
import { getHome } from '@/lib/home-data';

/**
 * The "your stuff" bar at the top of Digest. Designed to make
 * "these are MY cameras" unmistakable on first glance:
 *  - Strong header label with live count
 *  - Faux thumbnail per tile (so the eye reads "preview of mine", not "product card")
 *  - Live dot + weekly event count to communicate active/owned
 */
export function FleetRibbon() {
  const home = getHome();
  const onlineCount = home.cameras.filter((c) => c.online).length;
  const total = home.cameras.length;

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-[12px] p-3.5 mb-7">
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold tracking-[1.5px] uppercase text-wyze-green">
            YOUR FLEET
          </span>
          <span className="text-[10px] tracking-[1.5px] uppercase text-text-faint">
            · {total} cameras · {onlineCount === total ? 'all online' : `${onlineCount}/${total} online`}
          </span>
        </div>
        <a className="text-[11px] text-text-faint hover:text-text-secondary cursor-pointer">Manage →</a>
      </div>

      <div className={`grid gap-2 ${total <= 4 ? 'grid-cols-4' : 'grid-cols-6'}`}>
        {home.cameras.map((cam) => {
          const isCamPlus = cam.tier === 'cam-plus';
          return (
            <div
              key={cam.id}
              className={`group relative bg-black/40 rounded-[10px] overflow-hidden border ${
                isCamPlus ? 'border-wyze-green/25' : cam.online ? 'border-white/[0.05]' : 'border-red-400/20'
              } hover:bg-black/60 hover:-translate-y-0.5 transition-all cursor-pointer`}
            >
              {/* Faux thumbnail */}
              <div className="relative h-[72px] flex items-center justify-center bg-gradient-to-br from-[#1a201d] to-[#0a0a0a]">
                {cam.online ? (
                  <>
                    <Video size={20} className="text-white/15" />
                    <span className="absolute top-1.5 left-1.5 flex items-center gap-1 text-[8px] font-semibold tracking-[1px] uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      <span className="text-red-300">LIVE</span>
                    </span>
                    <span
                      className={`absolute bottom-1.5 right-1.5 text-[8px] font-semibold tracking-[1px] uppercase px-1.5 py-0.5 rounded ${
                        isCamPlus ? 'bg-wyze-green/20 text-wyze-green' : 'bg-white/[0.06] text-text-faint'
                      }`}
                    >
                      {isCamPlus ? 'CAM PLUS' : 'FREE'}
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-text-faint gap-1">
                    <WifiOff size={16} />
                    <span className="text-[8px] uppercase tracking-[1px]">offline</span>
                  </div>
                )}
              </div>

              {/* Tile footer */}
              <div className="px-2.5 py-1.5 flex items-baseline justify-between gap-1.5 min-w-0">
                <span className="text-[11px] font-medium truncate">{cam.name}</span>
                <span className="text-[9.5px] tabular-nums text-text-faint shrink-0">
                  {cam.eventsThisWeek}/wk
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
