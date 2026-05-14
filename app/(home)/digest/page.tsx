import { FleetRibbon } from '@/components/chrome/FleetRibbon';
import { SectionLabel } from '@/components/ui/Eyebrow';
import { StatsStrip } from '@/components/surfaces/digest/StatsStrip';
import { BriefingSection } from '@/components/surfaces/digest/BriefingSection';
import { HighlightBanner } from '@/components/surfaces/digest/HighlightBanner';
import { CatalogProductCard } from '@/components/ui/CatalogProductCard';
import { getCurrentHome } from '@/lib/home-data';
import { getRecommendations } from '@/lib/recommendations';
import { getHighlightBanner } from '@/lib/highlight-banner';
import { getBriefing } from '@/lib/briefing';
import { findProduct } from '@/lib/product-catalog';

/**
 * Digest is the data-and-recs layer. Three layers of AI-generated content here:
 *  1. "Built around your home" → AI picks 3 products from the catalog
 *  2. The highlight banner       → AI picks ONE high-priority recommendation
 *  3. "New since last order"     → static catalog spotlights (not personalized)
 *
 * Every product/CTA on this page is clickable and routes through the chat
 * rail's cart via useChatRail — no dead links.
 */
export default async function DigestPage() {
  const home = await getCurrentHome();
  const [briefing, recommendations, highlight] = await Promise.all([
    getBriefing(home),
    getRecommendations(home),
    getHighlightBanner(home),
  ]);

  const camOG = findProduct('cam-og');
  const climateSensor = findProduct('climate-sensor');
  const batteryCamPro = findProduct('battery-cam-pro');

  return (
    <div className="surface space-y-12">
      <BriefingSection briefing={briefing} />

      {/* This-week bar — sits as a thin divider between Briefing and Fleet. */}
      <StatsStrip />

      <FleetRibbon />

      <section className="space-y-8">
        <div>
          <SectionLabel>Built around your home</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <CatalogProductCard
                key={rec.slug}
                slug={rec.slug}
                imageSrc={rec.imageSrc}
                because={rec.because}
                name={rec.name}
                price={rec.price}
                strikePrice={rec.strikePrice}
                badge={rec.strikePrice ? '25% OFF' : undefined}
              />
            ))}
          </div>
        </div>

        {/* AI-picked highlight banner — single most valuable next step. */}
        <HighlightBanner highlight={highlight} />

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-text-faint">
              NEW SINCE YOUR LAST ORDER · {home.user.lastOrderMonthsAgo} MONTHS
            </div>
            <a className="text-[11px] text-text-faint hover:text-text-secondary cursor-pointer">See all →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {camOG && (
              <CatalogProductCard
                slug={camOG.slug}
                imageSrc={camOG.imageSrc}
                name={camOG.name}
                price={camOG.price}
                imageHeight={160}
              />
            )}
            {climateSensor && (
              <CatalogProductCard
                slug={climateSensor.slug}
                imageSrc={climateSensor.imageSrc}
                name={climateSensor.name}
                price={climateSensor.price}
                imageHeight={160}
              />
            )}
            {batteryCamPro && (
              <CatalogProductCard
                slug={batteryCamPro.slug}
                imageSrc={batteryCamPro.imageSrc}
                name={batteryCamPro.name}
                price={batteryCamPro.price}
                imageHeight={160}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
