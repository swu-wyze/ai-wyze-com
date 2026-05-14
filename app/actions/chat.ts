'use server';

import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/chat-context';
import { getHome } from '@/lib/home-data';
import { matchScript } from '@/lib/chat-script';
import type { ChatMessage } from '@/lib/types';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

export async function chat(messages: ChatMessage[]): Promise<{ text: string; mode: 'ai' | 'scripted' }> {
  const last = messages[messages.length - 1];
  const lastPrompt = last?.role === 'user' ? last.content : '';

  if (!process.env.ANTHROPIC_API_KEY) {
    // Graceful fallback: scripted response, same marker shape as real Claude.
    return { text: matchScript(lastPrompt), mode: 'scripted' };
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const home = getHome();
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: buildSystemPrompt(home),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => ('text' in b ? b.text : ''))
      .join('\n');

    return { text, mode: 'ai' };
  } catch (err) {
    console.error('Chat error:', err);
    return { text: matchScript(lastPrompt), mode: 'scripted' };
  }
}
