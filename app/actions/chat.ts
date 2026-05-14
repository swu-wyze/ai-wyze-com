'use server';

import { aiComplete, isAIConfigured } from '@/lib/ai';
import { buildSystemPrompt } from '@/lib/chat-context';
import { getCurrentHome } from '@/lib/home-data';
import { matchScript } from '@/lib/chat-script';
import type { ChatMessage } from '@/lib/types';

export async function chat(
  messages: ChatMessage[]
): Promise<{ text: string; mode: 'ai' | 'scripted' }> {
  const last = messages[messages.length - 1];
  const lastPrompt = last?.role === 'user' ? last.content : '';

  if (!isAIConfigured()) {
    // No provider configured — fall back to scripted demo responses.
    return { text: matchScript(lastPrompt), mode: 'scripted' };
  }

  const home = await getCurrentHome();
  const result = await aiComplete({
    system: buildSystemPrompt(home),
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    maxTokens: 1024,
  });

  if (!result) return { text: matchScript(lastPrompt), mode: 'scripted' };
  return { text: result.text, mode: 'ai' };
}
