// Suggestion chips rendered under the chat input when the thread is empty
// (or has only the auto-greeting). The full briefing now lives on the Digest
// page via lib/briefing.ts — this file only holds the chips.

import type { Home } from './types';

export function startingChipsFor(home: Home): string[] {
  switch (home.user.id) {
    case 'owen':
      return [
        "What's the cheapest way to cover both cameras?",
        'Show me everything I missed this week',
        'How does Cam Plus differ from Cam Unlimited?',
      ];
    case 'bob':
      return [
        "What's the cheapest way to cover all 3?",
        'Should I upgrade Baby to Cam Plus?',
        'Which cam isn’t earning its keep?',
      ];
    case 'sunny':
    default:
      return [
        'What did Angie see this week?',
        'Should I add a Lock Bolt?',
        'Should I upgrade to Cam Unlimited Pro?',
      ];
  }
}
