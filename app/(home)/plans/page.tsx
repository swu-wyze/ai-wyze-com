import { Eyebrow, SectionLabel } from '@/components/ui/Eyebrow';
import { PageTitle } from '@/components/ui/PageTitle';
import { getHome } from '@/lib/home-data';

export default function PlansPage() {
  const home = getHome();
  const onPlanCount = home.cameras.filter((c) => c.tier === 'cam-plus').length;
  return (
    <div className="surface">
      <Eyebrow className="mb-2">PLANS · YOUR SUBSCRIPTIONS</Eyebrow>
      <PageTitle
        title={`${onPlanCount} of ${home.cameras.length} cameras protected.`}
        subtitle={`Currently paying $${home.subs.currentMonthly.toFixed(2)}/mo for Cam Plus across ${onPlanCount} cameras.`}
      />

      {/* Current plan card */}
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-[10px] p-5 mb-7">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[15px] font-semibold mb-1">Cam Plus × {onPlanCount}</div>
            <div className="text-[12px] text-text-muted">
              ${home.subs.currentMonthly.toFixed(2)}/mo · billed monthly · Visa ending 3403
            </div>
          </div>
          <button className="bg-transparent text-text-secondary border border-text-faint/50 px-[14px] py-2 rounded-md text-[11px] hover:text-text-primary hover:border-text-muted transition-all">
            Manage billing
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {home.cameras.map((cam) => {
            const isCP = cam.tier === 'cam-plus';
            return (
              <div
                key={cam.id}
                className={`px-3 py-2 rounded-md flex items-center justify-between ${
                  isCP ? 'bg-wyze-green/[0.06] border border-wyze-green/15' : 'bg-white/[0.02] border border-white/[0.05]'
                }`}
              >
                <span className="text-[12px] font-medium">{cam.name}</span>
                <span className={`text-[10px] ${isCP ? 'text-wyze-green' : 'text-text-faint'}`}>
                  {isCP ? 'Cam Plus' : 'No plan'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrade simulator */}
      <SectionLabel>What if you switched?</SectionLabel>
      <p className="text-[12.5px] text-text-secondary mb-5 max-w-[640px]">
        All three options give you AI detection on every camera. Pick the math that fits.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-10">
        <SimOption
          tag="CURRENT + ADD"
          tagColor="text-text-muted"
          name="Cam Plus × 4"
          price="$11.96"
          period="per month"
          delta="+$2.99/mo"
          deltaSub="covers all 4, no AI Video Search"
          deltaTone="neutral"
          cta="Add Cam Plus to Backyard"
          ctaVariant="secondary"
        />
        <SimOption
          tag="RECOMMENDED"
          tagColor="text-wyze-green"
          name="Cam Unlimited"
          price="$9.99"
          priceColor="text-wyze-green"
          period="per month · all cameras"
          delta="Save $2/mo"
          deltaSub="+ AI Video Search, 60-day history"
          deltaTone="positive"
          cta="Try 14 days free"
          ctaVariant="primary"
          recommended
        />
        <SimOption
          tag="UPGRADE"
          tagColor="text-wyze-purple-light"
          name="Cam Unlimited Pro"
          price="$19.99"
          period="per month · all cameras"
          delta="+$10/mo"
          deltaSub="+ 24/7 monitoring, Direct Dispatch"
          deltaTone="neutral"
          cta="Learn more"
          ctaVariant="secondary"
        />
      </div>

      {/* Billing */}
      <SectionLabel>Billing & payment</SectionLabel>
      <div className="rounded-[10px] border border-white/[0.05] overflow-hidden">
        {[
          ['Next charge', '$8.97 on Jun 13, 2026'],
          ['Payment method', 'Visa ending in 3403 · Update →'],
          ['Billing history', 'View all charges →'],
        ].map(([label, value], i) => (
          <div key={label} className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? 'border-t border-white/[0.04]' : ''} bg-white/[0.02]`}>
            <div className="text-[12px] text-text-muted">{label}</div>
            <div className="text-[12.5px]">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SimOptionProps {
  tag: string;
  tagColor: string;
  name: string;
  price: string;
  priceColor?: string;
  period: string;
  delta: string;
  deltaSub: string;
  deltaTone: 'positive' | 'neutral';
  cta: string;
  ctaVariant: 'primary' | 'secondary';
  recommended?: boolean;
}

function SimOption({
  tag, tagColor, name, price, priceColor, period, delta, deltaSub, deltaTone, cta, ctaVariant, recommended,
}: SimOptionProps) {
  return (
    <div
      className={`rounded-[10px] p-5 ${
        recommended
          ? 'bg-hero-gradient border border-wyze-green/30'
          : 'bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.04] transition-all'
      }`}
    >
      <div className={`text-[10px] font-semibold tracking-[1.5px] uppercase mb-3 ${tagColor}`}>{tag}</div>
      <div className="text-[15px] font-semibold mb-2">{name}</div>
      <div className={`text-[28px] font-semibold tabular-nums leading-none mb-1 ${priceColor ?? ''}`}>{price}</div>
      <div className="text-[11px] text-text-faint mb-4">{period}</div>
      <div
        className={`text-[12px] mb-4 leading-snug ${
          deltaTone === 'positive' ? 'text-wyze-green' : 'text-text-muted'
        }`}
      >
        <div className="font-semibold">{delta}</div>
        <div className="text-text-faint mt-0.5">{deltaSub}</div>
      </div>
      <button
        className={`w-full px-[14px] py-2 rounded-md text-[11px] transition-all ${
          ctaVariant === 'primary'
            ? 'bg-wyze-green text-bg-base font-semibold hover:bg-[#4dffd0]'
            : 'bg-transparent text-text-secondary border border-text-faint/50 hover:text-text-primary hover:border-text-muted'
        }`}
      >
        {cta}
      </button>
    </div>
  );
}
