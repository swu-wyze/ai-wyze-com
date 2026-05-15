import { LandingHero } from '@/components/landing/LandingHero';
import { LandingOnboarding } from '@/components/landing/LandingOnboarding';
import { LandingDescriptiveAlerts } from '@/components/landing/LandingDescriptiveAlerts';
import { LandingPlans } from '@/components/landing/LandingPlans';
import { LandingReviews } from '@/components/landing/LandingReviews';
import { LandingProducts } from '@/components/landing/LandingProducts';

/**
 * Public pre-auth landing. The chat lives in the layout (ChatRailProvider +
 * ChatRail) so any client section can drive it via useChatRail().
 *
 * Section order mirrors the final wyzeai.html layout:
 *   1. Hero (product gallery)
 *   2. Onboarding (concern cards + persistent chat → ChatRail takeover)
 *   3. Descriptive Alerts (Never Wonder + demo video)
 *   4. Plans Compare (4 plan cards + side-by-side matrix)
 *   5. Reviews (Trusted by 12+M + carousel)
 *   6. Our Products (4 category cards)
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <LandingHero />
      <LandingOnboarding />
      <LandingDescriptiveAlerts />
      <LandingPlans />
      <LandingReviews />
      <LandingProducts />
    </div>
  );
}
