import type { Plan } from './types';

// Source of truth: https://www.wyze.com/pages/service-plans
// Note: there is NO "Cam Plus Pro" plan. Three tiers only:
//   Cam Plus (per camera) → Cam Unlimited (flat fleet) → Cam Unlimited Pro (flat fleet, premium).
// AI Video Search, 60-day history, and Direct Emergency Dispatch are
// EXCLUSIVE to Cam Unlimited Pro.
export const PLANS: Plan[] = [
  {
    id: 'cam-plus',
    name: 'Cam Plus',
    monthly: 2.99,
    annual: 29.99,
    features: [
      'Per-camera plan',
      'Person/Package/Vehicle/Pet detection',
      'Full-length event recording',
      '14-day cloud history',
    ],
  },
  {
    id: 'cam-unlimited',
    name: 'Cam Unlimited',
    monthly: 9.99,
    annual: 99.99,
    features: [
      'Unlimited cameras under one plan',
      'Everything in Cam Plus',
      'Multi-camera timeline + smart modes',
      'Facial recognition',
    ],
  },
  {
    id: 'cam-unlimited-pro',
    name: 'Cam Unlimited Pro',
    monthly: 19.99,
    annual: 199.99,
    features: [
      'Everything in Cam Unlimited',
      'Descriptive alerts',
      'AI Video Search',
      '60-day cloud history',
      '24/7 emergency dispatch',
    ],
  },
];
