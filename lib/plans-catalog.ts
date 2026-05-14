import type { Plan } from './types';

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
    id: 'cam-plus-pro',
    name: 'Cam Plus Pro',
    monthly: 8.99,
    annual: 89.99,
    features: [
      'Everything in Cam Plus',
      '24/7 professional monitoring',
      'Cellular backup',
      'Direct Emergency Dispatch',
    ],
  },
  {
    id: 'cam-unlimited',
    name: 'Cam Unlimited',
    monthly: 9.99,
    annual: 99.99,
    features: [
      'Unlimited cameras',
      'Everything in Cam Plus',
      'AI Video Search',
      '60-day cloud history',
    ],
  },
  {
    id: 'cam-unlimited-pro',
    name: 'Cam Unlimited Pro',
    monthly: 19.99,
    annual: 199.99,
    features: [
      'Everything in Cam Unlimited',
      'Everything in Cam Plus Pro',
    ],
  },
];
