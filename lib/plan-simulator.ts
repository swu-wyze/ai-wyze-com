// Pure logic for the Plans page upgrade simulator. Computes the three plan
// options (Cam Plus / Cam Unlimited / Cam Unlimited Pro) with prices, deltas,
// and CTA labels derived from the user's fleet + current plan.

import type { Home, PlanId } from './types';

export interface SimulatorOption {
  planId: PlanId;
  /** Tag shown above the card: CURRENT / RECOMMENDED / UPGRADE / SAVE / ADD. */
  tag: string;
  /** Tag color hint — interpreted by the renderer. */
  tagTone: 'neutral' | 'recommended' | 'current' | 'savings';
  name: string;
  /** Just the dollar value as a string for display (e.g. "$11.96"). */
  priceLabel: string;
  /** Subtitle under the price. */
  period: string;
  /** Bold delta line (e.g. "Save $2/mo", "+$10/mo", "Current spend"). */
  delta: string;
  deltaTone: 'positive' | 'neutral';
  /** One-line feature summary. */
  features: string;
  /** Button label — uses the existing cart parser's "Try ... free for 14 days" pattern. */
  cta: string;
  /** True when this is the user's current plan; disables the CTA. */
  isCurrent: boolean;
  /** True when AI recommends this as the user's best fit. */
  isRecommended: boolean;
  /** AI's one-line reason for the recommendation (when isRecommended). */
  reasonWhy?: string;
}

const CAM_PLUS_PER_CAM = 2.99;
const CAM_UNLIMITED = 9.99;
const CAM_UNLIMITED_PRO = 19.99;

/**
 * Maps the human-facing plan name on the Home to a stable PlanId, or null
 * if the user has no plan.
 */
function inferCurrentPlanId(home: Home): PlanId | null {
  const name = home.subs.planName.toLowerCase();
  if (/unlimited pro/.test(name)) return 'cam-unlimited-pro';
  if (/unlimited/.test(name)) return 'cam-unlimited';
  if (/cam plus/.test(name)) return 'cam-plus';
  return null;
}

function fmt(n: number): string {
  return `$${n.toFixed(2)}`;
}

function diffLabel(thisMonthly: number, current: number): { delta: string; tone: 'positive' | 'neutral' } {
  if (current === 0) return { delta: `${fmt(thisMonthly)}/mo`, tone: 'neutral' };
  const d = thisMonthly - current;
  if (Math.abs(d) < 0.01) return { delta: 'Current spend', tone: 'neutral' };
  if (d < 0) return { delta: `Save ${fmt(-d)}/mo`, tone: 'positive' };
  return { delta: `+${fmt(d)}/mo`, tone: 'neutral' };
}

export function buildSimulator(
  home: Home,
  recommendation: { planId: PlanId; reason: string }
): SimulatorOption[] {
  const fleetSize = home.cameras.length;
  const current = home.subs.currentMonthly;
  const currentId = inferCurrentPlanId(home);

  const camPlusTotal = CAM_PLUS_PER_CAM * fleetSize;
  const camPlusDelta = diffLabel(camPlusTotal, current);
  const unlimitedDelta = diffLabel(CAM_UNLIMITED, current);
  const proDelta = diffLabel(CAM_UNLIMITED_PRO, current);

  return [
    {
      planId: 'cam-plus',
      tag: currentId === 'cam-plus' ? 'CURRENT' : 'PER-CAMERA',
      tagTone: currentId === 'cam-plus' ? 'current' : 'neutral',
      name: `Cam Plus × ${fleetSize}`,
      priceLabel: fmt(camPlusTotal),
      period: 'per month',
      delta: currentId === 'cam-plus' ? 'Current spend' : camPlusDelta.delta,
      deltaTone: currentId === 'cam-plus' ? 'neutral' : camPlusDelta.tone,
      features: 'Full clips, 14-day history, AI detection per camera.',
      cta: currentId === 'cam-plus' ? "You're on this plan" : 'Try Cam Plus free for 14 days',
      isCurrent: currentId === 'cam-plus',
      isRecommended: recommendation.planId === 'cam-plus',
      reasonWhy: recommendation.planId === 'cam-plus' ? recommendation.reason : undefined,
    },
    {
      planId: 'cam-unlimited',
      tag: currentId === 'cam-unlimited' ? 'CURRENT' : 'FLAT FLEET',
      tagTone: currentId === 'cam-unlimited' ? 'current' : 'neutral',
      name: 'Cam Unlimited',
      priceLabel: fmt(CAM_UNLIMITED),
      period: 'per month · all cameras',
      delta: currentId === 'cam-unlimited' ? 'Current spend' : unlimitedDelta.delta,
      deltaTone: currentId === 'cam-unlimited' ? 'neutral' : unlimitedDelta.tone,
      features: 'Cam Plus features + facial recognition + multi-cam timeline.',
      cta: currentId === 'cam-unlimited' ? "You're on this plan" : 'Try Cam Unlimited free for 14 days',
      isCurrent: currentId === 'cam-unlimited',
      isRecommended: recommendation.planId === 'cam-unlimited',
      reasonWhy: recommendation.planId === 'cam-unlimited' ? recommendation.reason : undefined,
    },
    {
      planId: 'cam-unlimited-pro',
      tag: currentId === 'cam-unlimited-pro' ? 'CURRENT' : 'PRO',
      tagTone: currentId === 'cam-unlimited-pro' ? 'current' : 'neutral',
      name: 'Cam Unlimited Pro',
      priceLabel: fmt(CAM_UNLIMITED_PRO),
      period: 'per month · all cameras',
      delta: currentId === 'cam-unlimited-pro' ? 'Current spend' : proDelta.delta,
      deltaTone: currentId === 'cam-unlimited-pro' ? 'neutral' : proDelta.tone,
      features: 'Cam Unlimited + AI Video Search + 60-day history + 24/7 dispatch.',
      cta:
        currentId === 'cam-unlimited-pro'
          ? "You're on this plan"
          : 'Try Cam Unlimited Pro free for 14 days',
      isCurrent: currentId === 'cam-unlimited-pro',
      isRecommended: recommendation.planId === 'cam-unlimited-pro',
      reasonWhy: recommendation.planId === 'cam-unlimited-pro' ? recommendation.reason : undefined,
    },
  ];
}
