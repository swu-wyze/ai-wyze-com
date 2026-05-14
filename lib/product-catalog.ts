// Curated subset of the Wyze catalog. The AI recommender picks from this list
// (by slug) so we always get real product names + real image URLs. To add or
// remove products, edit this file — the AI prompt is built from it dynamically.

export interface CatalogProduct {
  slug: string;
  name: string;
  category: 'doorbell' | 'camera' | 'floodlight' | 'lock' | 'sensor' | 'service';
  price: string;
  strikePrice?: string;
  imageSrc: string;
  /** A short pitch the AI can lean on when deciding which user this product fits. */
  pitch: string;
}

export const CATALOG: CatalogProduct[] = [
  {
    slug: 'doorbell-pro',
    name: 'Video Doorbell Pro',
    category: 'doorbell',
    price: '$89.98',
    strikePrice: '$119.98',
    imageSrc:
      'https://www.wyze.com/cdn/shop/files/wyze-battery-video-doorbell-wyze-labs-inc-6120700.webp?v=1775080127&width=700',
    pitch:
      'Two-way talk, porch-tuned motion zones, chime alerts. Pairs well with a Cam v3/v4 already at the front door.',
  },
  {
    slug: 'floodlight-pro',
    name: 'Floodlight Pro',
    category: 'floodlight',
    price: '$99.98',
    imageSrc:
      'https://www.wyze.com/cdn/shop/files/wyze-cam-floodlight-pro-wyze-labs-inc-565701.png?v=1762440313&width=700',
    pitch:
      '2,600-lumen lights + camera. Great for backyards or driveways with heavy after-dark activity.',
  },
  {
    slug: 'lock-bolt',
    name: 'Lock Bolt',
    category: 'lock',
    price: '$79.98',
    imageSrc:
      'https://www.wyze.com/cdn/shop/files/wyze-lock-bolt-wyze-labs-inc-2533666.jpg?v=1762439885&width=700',
    pitch:
      'Fingerprint + keypad smart deadbolt. Completes a front-door setup with a doorbell/cam already in place.',
  },
  {
    slug: 'cam-og',
    name: 'Cam OG',
    category: 'camera',
    price: '$34.98',
    imageSrc:
      'https://www.wyze.com/cdn/shop/files/wyze-cam-og-wyze-labs-inc-9019150.png?v=1773256160&width=700',
    pitch:
      'Cheapest indoor cam. Good for adding a second angle on a room you already monitor.',
  },
  {
    slug: 'cam-pan-v4',
    name: 'Cam Pan v4',
    category: 'camera',
    price: '$49.98',
    imageSrc:
      'https://www.wyze.com/cdn/shop/files/wyze-cam-pan-v4-wyze-labs-inc-7068445.jpg?v=1756312046&width=700',
    pitch:
      '360° pan/tilt indoor cam. Ideal for nurseries or rooms where one fixed cam misses too much.',
  },
  {
    slug: 'cam-v4',
    name: 'Cam v4',
    category: 'camera',
    price: '$35.98',
    imageSrc:
      'https://www.wyze.com/cdn/shop/files/wyze-cam-v4-wyze-labs-inc-5186547.png?v=1762447655&width=700',
    pitch:
      'Flagship indoor/outdoor cam. 2.5K, color night vision. Good upgrade from older v3 cams.',
  },
  {
    slug: 'battery-cam-pro',
    name: 'Battery Cam Pro',
    category: 'camera',
    price: '$149.98',
    imageSrc:
      'https://www.wyze.com/cdn/shop/files/wyze-battery-cam-pro-wyze-labs-inc-1939761.png?v=1762439887&width=700',
    pitch:
      'Battery-powered, wire-free outdoor cam. Useful where running power is impractical (side yards, garages).',
  },
  {
    slug: 'climate-sensor',
    name: 'Climate Sensor',
    category: 'sensor',
    price: '$24.98',
    imageSrc:
      'https://www.wyze.com/cdn/shop/files/wyze-sense-climate-sensor-wyze-labs-inc-625583.png?v=1762439822&width=533',
    pitch:
      'Temperature + humidity sensor. Good add-on for households with babies (nurseries) or pets.',
  },
  {
    slug: 'window-cam',
    name: 'Window Cam',
    category: 'camera',
    price: '$59.98',
    imageSrc:
      'https://www.wyze.com/cdn/shop/files/wyze-window-cam-wyze-labs-inc-1320283.webp?v=1764170052&width=700',
    pitch:
      'Suction-cup mounted window-facing cam. Great when you want to watch the street or a specific outdoor view from inside.',
  },
];

export function findProduct(slug: string): CatalogProduct | undefined {
  return CATALOG.find((p) => p.slug === slug);
}

/** Serialized catalog for the AI prompt. Excludes price/strike so the AI focuses on fit. */
export function catalogForPrompt(): string {
  return CATALOG.map((p) => `- ${p.slug}: ${p.name} (${p.category}) — ${p.pitch}`).join('\n');
}
