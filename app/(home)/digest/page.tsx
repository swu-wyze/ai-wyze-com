import { Shield } from 'lucide-react';
import { FleetRibbon } from '@/components/chrome/FleetRibbon';
import { SectionLabel } from '@/components/ui/Eyebrow';
import { StatsStrip } from '@/components/surfaces/digest/StatsStrip';
import { BriefingSection } from '@/components/surfaces/digest/BriefingSection';
import { ProductCard } from '@/components/ui/ProductCard';
import { getCurrentHome } from '@/lib/home-data';
import { getRecommendations } from '@/lib/recommendations';
import { getHighlightBanner, resolveIllustration } from '@/lib/highlight-banner';
import { getBriefing } from '@/lib/briefing';
import { findProduct } from '@/lib/product-catalog';

/**
 * Digest is the data-and-recs layer. The narrative briefing lives in the
 * agent rail on the left. Three layers of AI-generated content here:
 *  1. "Built around your home" → AI picks 3 products from the catalog
 *  2. The highlight banner       → AI picks ONE high-priority recommendation
 *  3. "New since last order"     → static catalog spotlights (not personalized)
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

  const highlightImageSrc = resolveIllustration(highlight.illustrationSlug);
  const accentText = highlight.accent === 'purple' ? 'text-accent-purple' : 'text-wyze-green';
  const accentBg = highlight.accent === 'purple' ? 'bg-accent-purple/[0.08]' : 'bg-wyze-green/[0.08]';
  const accentBorder = highlight.accent === 'purple' ? 'border-accent-purple/15' : 'border-wyze-green/20';
  const accentBtnBg = highlight.accent === 'purple' ? 'bg-accent-purple/15 hover:bg-accent-purple/25' : 'bg-wyze-green/15 hover:bg-wyze-green/25';
  const accentBtnBorder = highlight.accent === 'purple' ? 'border-accent-purple/25' : 'border-wyze-green/30';

  return (
    <div className="surface space-y-12">
      <BriefingSection briefing={briefing} />

      <FleetRibbon />

      <section>
        <SectionLabel>This week</SectionLabel>
        <StatsStrip />
      </section>

      <section className="space-y-8">
        <div>
          <SectionLabel>Built around your home</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <ProductCard
                key={rec.slug}
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

        {/* AI-picked highlight banner — what the agent thinks is the
            single most valuable next step for this user. */}
        <div className={`${accentBg} border ${accentBorder} rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6`}>
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              {highlightImageSrc ? (
                <img src={highlightImageSrc} alt="" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" loading="lazy" />
              ) : (
                <Shield size={22} className={accentText} />
              )}
            </div>
            <div className="min-w-0">
              <div className={`text-[10.5px] sm:text-[11px] font-bold tracking-[1.5px] uppercase mb-1.5 ${accentText}`}>
                {highlight.eyebrow}
              </div>
              <div className="text-[16px] sm:text-[17px] font-semibold mb-1 text-text-primary leading-snug">
                {highlight.title}
              </div>
              <div className="text-[12.5px] sm:text-[13px] text-text-muted">
                <span className={`font-semibold ${accentText}`}>{highlight.priceLine.split(' · ')[0]}</span>
                {highlight.priceLine.includes(' · ') && (
                  <span> · {highlight.priceLine.split(' · ').slice(1).join(' · ')}</span>
                )}
              </div>
            </div>
          </div>
          <button
            className={`${accentBtnBg} ${accentText} border ${accentBtnBorder} px-6 py-2.5 rounded-lg font-medium text-[13px] whitespace-nowrap transition-colors w-full sm:w-auto sm:shrink-0`}
          >
            {highlight.ctaLabel}
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-text-faint">
              NEW SINCE YOUR LAST ORDER · {home.user.lastOrderMonthsAgo} MONTHS
            </div>
            <a className="text-[11px] text-text-faint hover:text-text-secondary cursor-pointer">See all →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {camOG && <ProductCard imageSrc={camOG.imageSrc} name={camOG.name} price={camOG.price} imageHeight={160} />}
            {climateSensor && (
              <ProductCard imageSrc={climateSensor.imageSrc} name={climateSensor.name} price={climateSensor.price} imageHeight={160} />
            )}
            {batteryCamPro && (
              <ProductCard
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
