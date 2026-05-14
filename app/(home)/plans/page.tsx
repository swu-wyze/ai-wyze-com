import { Eyebrow, SectionLabel } from '@/components/ui/Eyebrow';
import { PageTitle } from '@/components/ui/PageTitle';
import { PlanSimulator } from '@/components/surfaces/plans/PlanSimulator';
import { getCurrentHome } from '@/lib/home-data';
import { getPlanRecommendation } from '@/lib/plan-recommendation';
import { buildSimulator } from '@/lib/plan-simulator';

export default async function PlansPage() {
  const home = await getCurrentHome();
  const recommendation = await getPlanRecommendation(home);
  const options = buildSimulator(home, recommendation);

  const onPlanCount = home.cameras.filter((c) => c.tier === 'cam-plus').length;
  const hasPlan = home.subs.currentMonthly > 0;

  // Demo billing details — date is fictional, dollar amount tracks the real
  // current spend so the page stays internally consistent per user.
  const nextChargeStr = hasPlan
    ? `$${home.subs.currentMonthly.toFixed(2)} on Jun 13, 2026`
    : 'No active subscription';

  return (
    <div className="surface">
      <Eyebrow className="mb-2">PLANS · YOUR SUBSCRIPTIONS</Eyebrow>
      <PageTitle
        title={`${onPlanCount} of ${home.cameras.length} cameras protected.`}
        subtitle={
          hasPlan
            ? `Currently paying $${home.subs.currentMonthly.toFixed(2)}/mo · ${home.subs.planName}.`
            : `No active subscription — your cameras record 12-second clips only.`
        }
      />

      {/* Current plan card */}
      <div className="bg-surface-1 border border-faint rounded-[10px] p-5 mb-7">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <div className="text-[15px] font-semibold mb-1">{home.subs.planName}</div>
            <div className="text-[12px] text-text-muted">
              {hasPlan
                ? `$${home.subs.currentMonthly.toFixed(2)}/mo · billed monthly · Visa ending 3403`
                : 'Sign up for any plan below to start protecting your cameras.'}
            </div>
          </div>
          {hasPlan && (
            <button className="bg-transparent text-text-secondary border border-text-faint/50 px-[14px] py-2 rounded-md text-[11px] hover:text-text-primary hover:border-text-muted transition-all self-start">
              Manage billing
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {home.cameras.map((cam) => {
            const isCP = cam.tier === 'cam-plus';
            return (
              <div
                key={cam.id}
                className={`px-3 py-2 rounded-md flex items-center justify-between ${
                  isCP ? 'bg-wyze-green/[0.06] border border-wyze-green/15' : 'bg-surface-1 border border-faint'
                }`}
              >
                <span className="text-[12px] font-medium truncate">{cam.name}</span>
                <span className={`text-[10px] shrink-0 ml-2 ${isCP ? 'text-accent-green' : 'text-text-faint'}`}>
                  {isCP ? 'Covered' : 'No plan'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrade simulator */}
      <SectionLabel>What if you switched?</SectionLabel>
      <p className="text-[12.5px] text-text-secondary mb-5">
        Wyze Intelligence picked one as the best fit for your {home.cameras.length}-camera setup.
        Pick the math that works for you.
      </p>

      <PlanSimulator options={options} />

      {/* Billing */}
      {hasPlan && (
        <>
          <SectionLabel>Billing & payment</SectionLabel>
          <div className="rounded-[10px] border border-faint overflow-hidden">
            {[
              ['Next charge', nextChargeStr],
              ['Payment method', 'Visa ending in 3403 · Update →'],
              ['Billing history', 'View all charges →'],
            ].map(([label, value], i) => (
              <div
                key={label}
                className={`flex items-center justify-between px-4 py-3.5 ${
                  i > 0 ? 'border-t border-faint' : ''
                } bg-surface-1`}
              >
                <div className="text-[12px] text-text-muted">{label}</div>
                <div className="text-[12.5px]">{value}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
