import { WifiOff } from 'lucide-react';
import { getCurrentHome } from '@/lib/home-data';

/**
 * Hero camera grid at the top of Digest. Sized to be the visual anchor of the
 * page — aspect-video tiles, full-bleed faux feeds, overlay labels with dark
 * gradient at the bottom for legibility. Cameras read as premium media tiles,
 * not as a navigation strip.
 */
export async function FleetRibbon() {
  const home = await getCurrentHome();
  const onlineCount = home.cameras.filter((c) => c.online).length;
  const total = home.cameras.length;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="min-w-0">
          <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.01em] text-text-primary">Your Fleet</h2>
          <p className="text-[12px] sm:text-[13px] text-text-muted mt-0.5">
            {total} cameras · {onlineCount === total ? 'all online' : `${onlineCount} of ${total} online`}
          </p>
        </div>
        <a className="text-[12px] sm:text-[13px] font-medium text-wyze-green hover:opacity-80 cursor-pointer flex items-center gap-1 shrink-0">
          <span className="hidden sm:inline">Manage fleet</span><span className="sm:hidden">Manage</span> <span aria-hidden>→</span>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {home.cameras.map((cam) => {
          const isCamPlus = cam.tier === 'cam-plus';
          return (
            <div
              key={cam.id}
              className="group relative bg-black rounded-2xl overflow-hidden shadow-md aspect-video cursor-pointer"
            >
              {cam.online ? (
                <>
                  {cam.previewSrc && (
                    <img
                      src={cam.previewSrc}
                      alt=""
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      loading="lazy"
                    />
                  )}

                  {/* LIVE pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-[11px] font-medium z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </div>

                  {/* Tier pill */}
                  <div
                    className={`absolute bottom-3 right-3 text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded z-10 ${
                      isCamPlus ? 'bg-wyze-green text-[#0a0a0a]' : 'bg-gray-600 text-white'
                    }`}
                  >
                    {isCamPlus ? 'Cam Plus' : 'Free'}
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none">
                    <h3 className="text-white font-medium text-[15px] leading-tight">{cam.name}</h3>
                    <p className="text-gray-300 text-[11.5px] tabular-nums mt-0.5">{cam.eventsThisWeek} events/wk</p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <WifiOff size={28} />
                  <span className="text-[11px] uppercase tracking-[1px]">offline</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
