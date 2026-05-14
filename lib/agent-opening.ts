// Starting suggestion chips that appear below the chat input on the rail's
// empty state. Derived from the user's actual fleet: we surface hardware
// categories they're MISSING first, then add-ons (lock, sensor), then a
// generic catch-all. Each chip phrases as a natural "Add X" request so the
// AI's reply includes a [PRODUCT: slug] card the user can drop in the cart.

import type { Home } from './types';

interface Owned {
  doorbell: boolean;
  floodlight: boolean;
  outdoor: boolean;
  /** The camera in a baby/nursery room, if any — drives sensor copy. */
  nurseryCam: Home['cameras'][number] | undefined;
}

function inferOwned(home: Home): Owned {
  return {
    doorbell: home.cameras.some((c) => /doorbell/i.test(c.model)),
    floodlight: home.cameras.some((c) => /floodlight/i.test(c.model)),
    outdoor: home.cameras.some(
      (c) =>
        /yard|porch|deck|drive|patio|garden|outdoor/i.test(c.name) ||
        /outdoor|battery|floodlight/i.test(c.model)
    ),
    nurseryCam: home.cameras.find((c) => /angie|baby|nursery|kid/i.test(c.name)),
  };
}

export function startingChipsFor(home: Home): string[] {
  const owned = inferOwned(home);
  const candidates: string[] = [];

  // Tier 1 — primary fleet gaps (something they don't have a category for yet)
  if (!owned.doorbell) candidates.push('Add a Video Doorbell to my front door');
  if (!owned.outdoor) candidates.push('Add an outdoor camera for the backyard');
  if (!owned.floodlight) candidates.push('Add a Floodlight Cam for outdoor lighting');

  // Tier 2 — broadly-useful add-ons that aren't cameras
  candidates.push('Add a Smart Lock to my front door');
  if (owned.nurseryCam) {
    candidates.push(`Add a Climate Sensor for ${owned.nurseryCam.name}'s room`);
  } else {
    candidates.push('Add a Climate Sensor');
  }

  // Tier 3 — generic expansion when there's nothing obvious missing
  candidates.push('Add another camera to my system');

  return candidates.slice(0, 3);
}
