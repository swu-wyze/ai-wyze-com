import { FleetRibbon } from '@/components/chrome/FleetRibbon';
import { SectionLabel } from '@/components/ui/Eyebrow';
import { StatsStrip } from '@/components/surfaces/digest/StatsStrip';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductIllustration } from '@/components/ui/ProductIllustration';
import { getHome } from '@/lib/home-data';

/**
 * Digest is the data-and-recs layer. The narrative briefing — what changed,
 * which patterns matter, what to do — lives in the agent rail on the left.
 * The two used to overlap (both said "Since Sunday, three things…"); we
 * moved the narrative entirely into the agent so the page can do what a
 * sidebar can't: show the fleet, the week's numbers, and the personalized
 * product recommendations at full width.
 */
export default function DigestPage() {
  const home = getHome();
  return (
    <div className="surface">
      <FleetRibbon />

      <SectionLabel>This week</SectionLabel>
      <StatsStrip />

      <div className="mt-10">
        <SectionLabel>Built around your home</SectionLabel>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <ProductCard
            illustration={<ProductIllustration variant="doorbell" />}
            because="FOR YOUR FRONT DOOR V3"
            name="Video Doorbell Pro"
            price="$89.98"
            strikePrice="$119.98"
            badge="25% OFF"
          />
          <ProductCard
            illustration={<ProductIllustration variant="floodlight" />}
            because="73% OF BACKYARD EVENTS AT NIGHT"
            name="Floodlight Pro"
            price="$99.98"
          />
          <ProductCard
            illustration={<ProductIllustration variant="lock" />}
            because="COMPLETES YOUR FRONT DOOR"
            name="Lock Bolt"
            price="$79.98"
          />
        </div>

        {/* Wide module: Cam Plus Pro for Nursery */}
        <div className="bg-white/[0.03] border border-wyze-purple-light/15 rounded-[10px] p-5 mb-8 flex items-center gap-6">
          <div className="shrink-0 w-24 h-24 flex items-center justify-center bg-black/30 rounded-[10px]">
            <ProductIllustration variant="shield" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-semibold tracking-[1.5px] uppercase mb-2 text-wyze-purple-light">
              FOR THE CAM YOU CHECK AT 3AM
            </div>
            <div className="text-[18px] font-semibold mb-2">Cam Plus Pro — Nursery</div>
            <div className="flex items-baseline gap-3">
              <span className="text-[16px] font-semibold text-wyze-purple-light tabular-nums">+$6/mo</span>
              <span className="text-[11px] text-text-faint">or included with Cam Unlimited Pro</span>
            </div>
          </div>
          <button className="bg-wyze-purple/20 text-wyze-purple-light border border-wyze-purple-light/30 px-[18px] py-2.5 rounded-md text-xs hover:bg-wyze-purple/30 transition-all whitespace-nowrap">
            Add to Nursery
          </button>
        </div>

        {/* New since last order */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-text-faint">
            NEW SINCE YOUR LAST ORDER · {home.user.lastOrderMonthsAgo} MONTHS
          </div>
          <a className="text-[11px] text-text-faint hover:text-text-secondary cursor-pointer">See all →</a>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <ProductCard
            illustration={<ProductIllustration variant="cam" />}
            name="Cam OG 2"
            price="$34.98"
            imageHeight={140}
          />
          <ProductCard
            illustration={<ProductIllustration variant="sensor" />}
            name="Climate Sensor"
            price="$24.98"
            imageHeight={140}
          />
          <ProductCard
            illustration={<ProductIllustration variant="router" />}
            name="Mesh Router Pro"
            price="$149.98"
            imageHeight={140}
          />
        </div>
      </div>
    </div>
  );
}
