'use server';

import { aiComplete, isAIConfigured } from '@/lib/ai';
import { buildSystemPrompt } from '@/lib/chat-context';
import { getCurrentHome } from '@/lib/home-data';
import { matchScript } from '@/lib/chat-script';
import type { ChatMessage } from '@/lib/types';

/**
 * Chat completion server action.
 *
 * `cartSummary` is an optional pre-formatted list of items the user has
 * committed to in this session (added to cart but not checked out). It's
 * appended to the system prompt so the AI treats those items as already
 * chosen — no re-pitching what's pending.
 */
export async function chat(
  messages: ChatMessage[],
  cartSummary?: string
): Promise<{ text: string; mode: 'ai' | 'scripted' }> {
  const last = messages[messages.length - 1];
  const lastPrompt = last?.role === 'user' ? last.content : '';

  if (!isAIConfigured()) {
    return { text: matchScript(lastPrompt), mode: 'scripted' };
  }

  const home = await getCurrentHome();

  let systemPrompt = buildSystemPrompt(home);
  if (cartSummary && cartSummary.trim().length > 0) {
    systemPrompt += `

PENDING CART (the user has committed to these items in the current session — awaiting checkout):
${cartSummary}

CRITICAL — TREAT CART ITEMS AS ALREADY CHOSEN
- Do NOT re-pitch any plan or product already listed above.
- Do NOT emit an [ACTION: Try X free for 30 days] or [ACTION: Move to X] for anything in the cart.
- Do NOT emit a [PRODUCT: <slug>] card for a hardware item already in the cart.
- If the user asks about something in the cart, reference it as "the [X] you've added" and walk through what it does.
- Suggested actions should focus on what's NEXT (configure, install, see what changes, check out) — not on re-acquiring what's pending.`;
  }

  const result = await aiComplete({
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    maxTokens: 1024,
  });

  if (!result) return { text: matchScript(lastPrompt), mode: 'scripted' };
  return { text: result.text, mode: 'ai' };
}
