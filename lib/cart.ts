// Cart that lives inside the chat rail. Pattern-matches chat action labels
// onto cart items so clicking [ACTION: Add Doorbell Pro to cart] in an
// assistant message actually adds a line to the running ledger.
//
// Mixes two ledgers: subscription changes ($/mo) and hardware buys (one-time).
// That single ledger is what wyze.com today doesn't have — the agent's value.

export type CartItemKind = 'plan' | 'plan-change' | 'hardware';

export interface CartItem {
  id: string;
  kind: CartItemKind;
  name: string;
  detail?: string;
  monthly?: number;
  oneTime?: number;
  badge?: string;
}

interface CartTotals {
  monthly: number;
  oneTime: number;
  monthlySavings: number;
}

export function cartTotals(items: CartItem[], currentMonthly: number): CartTotals {
  let newMonthly = 0;
  let oneTime = 0;
  let planTouched = false;

  for (const i of items) {
    if (i.kind === 'plan') {
      newMonthly += i.monthly ?? 0;
      planTouched = true;
    } else if (i.kind === 'hardware') {
      oneTime += i.oneTime ?? 0;
    }
    // 'plan-change' is $0 net by design (license reassignment)
  }

  // If a new plan is added, it REPLACES current sub spend; otherwise current stays.
  const monthlyDelta = planTouched ? newMonthly - currentMonthly : newMonthly;

  return {
    monthly: planTouched ? newMonthly : currentMonthly + newMonthly,
    oneTime,
    monthlySavings: planTouched && monthlyDelta < 0 ? Math.abs(monthlyDelta) : 0,
  };
}

/**
 * Maps a chat [ACTION: Label] to a cart line. Returns null for navigational
 * actions like "See product details" or "Show the math".
 */
export function parseActionToCartItem(label: string): CartItem | null {
  const l = label.toLowerCase();

  // Plan trials / upgrades
  if (/try .*unlimited pro.*free/.test(l)) {
    return {
      id: 'plan-cam-unlimited-pro',
      kind: 'plan',
      name: 'Cam Unlimited Pro',
      detail: '$19.99/mo · 24/7 emergency dispatch + AI Video Search + 60-day history · 30-day free trial',
      monthly: 19.99,
      badge: 'TRIAL',
    };
  }
  if (/try .*unlimited.*free/.test(l) || /^try 30 days free/.test(l)) {
    return {
      id: 'plan-cam-unlimited',
      kind: 'plan',
      name: 'Cam Unlimited',
      detail: '$9.99/mo · covers unlimited cameras · 30-day free trial',
      monthly: 9.99,
      badge: 'TRIAL',
    };
  }
  if (/try cam plus(?! pro)/.test(l)) {
    return {
      id: 'plan-cam-plus',
      kind: 'plan',
      name: 'Cam Plus',
      detail: '$2.99/mo per camera · full-length clips + 14-day history · 30-day free trial',
      monthly: 2.99,
      badge: 'TRIAL',
    };
  }

  // License reassignment
  const move = /move .*from (.*?) to (.*)/.exec(l);
  if (move) {
    const from = move[1].trim();
    const to = move[2].trim();
    return {
      id: `reassign-${from}-${to}`,
      kind: 'plan-change',
      name: `Move Cam Plus → ${capitalize(to)}`,
      detail: `Reassign license from ${capitalize(from)} · no billing change`,
      monthly: 0,
      badge: 'FREE',
    };
  }

  // Hardware adds
  if (/add doorbell|doorbell pro to cart|doorbell.*cart/.test(l)) {
    return {
      id: 'hw-doorbell-pro',
      kind: 'hardware',
      name: 'Video Doorbell Pro',
      detail: '$89.98 · was $119.98 · 25% off this week',
      oneTime: 89.98,
      badge: '-25%',
    };
  }
  if (/add floodlight|floodlight.*cart/.test(l)) {
    return {
      id: 'hw-floodlight',
      kind: 'hardware',
      name: 'Floodlight Pro',
      detail: '$99.98 · pairs with Backyard cam',
      oneTime: 99.98,
    };
  }
  if (/add lock|lock bolt/.test(l)) {
    return {
      id: 'hw-lock-bolt',
      kind: 'hardware',
      name: 'Lock Bolt',
      detail: '$79.98 · completes your front door',
      oneTime: 79.98,
    };
  }

  return null;
}

function capitalize(s: string): string {
  return s
    .split(' ')
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(' ');
}

/**
 * Builds a cart line directly from a catalog slug (used by inline product
 * cards rendered in chat — clicking "Add to cart" on the card calls this).
 */
export function cartItemFromProductSlug(
  slug: string,
  product: { name: string; price: string; strikePrice?: string; pitch: string }
): CartItem {
  const oneTime = parseFloat(product.price.replace(/[^\d.]/g, '')) || 0;
  return {
    id: `hw-${slug}`,
    kind: 'hardware',
    name: product.name,
    detail: product.pitch,
    oneTime,
    badge: product.strikePrice ? '-25%' : undefined,
  };
}
