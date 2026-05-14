// Provider-agnostic AI shim. Defaults to DeepSeek; swappable to OpenAI or
// Anthropic via env vars. Designed so the rest of the app never imports a
// specific SDK — it just calls `aiComplete()` and gets text back.
//
// Env:
//   AI_PROVIDER    deepseek | openai | anthropic     (default: deepseek)
//   AI_API_KEY     the key                            (required for live AI)
//   AI_MODEL       override model name                (defaults per provider)
//   AI_BASE_URL    override base URL                  (defaults per provider)
//
// Legacy: ANTHROPIC_API_KEY + ANTHROPIC_MODEL still honored when
// AI_PROVIDER=anthropic and AI_API_KEY is not set.

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export type AIProvider = 'deepseek' | 'openai' | 'anthropic';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  system?: string;
  messages: AIMessage[];
  maxTokens?: number;
  /** When 'json', asks the provider for a JSON object back. Falls back to plain text on Anthropic. */
  responseFormat?: 'text' | 'json';
  /** 0–1, defaults to provider default. */
  temperature?: number;
}

export interface AIResult {
  text: string;
  provider: AIProvider;
  model: string;
}

interface ProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseURL?: string;
}

function resolveProvider(): ProviderConfig | null {
  const provider = (process.env.AI_PROVIDER ?? 'deepseek').toLowerCase() as AIProvider;
  const apiKey =
    process.env.AI_API_KEY ??
    (provider === 'anthropic' ? process.env.ANTHROPIC_API_KEY : undefined) ??
    '';
  if (!apiKey) return null;

  const defaults: Record<AIProvider, { model: string; baseURL?: string }> = {
    deepseek: { model: 'deepseek-chat', baseURL: 'https://api.deepseek.com' },
    openai: { model: 'gpt-4o-mini' },
    anthropic: { model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6' },
  };

  return {
    provider,
    apiKey,
    model: process.env.AI_MODEL ?? defaults[provider].model,
    baseURL: process.env.AI_BASE_URL ?? defaults[provider].baseURL,
  };
}

/** Returns true if any AI provider is configured with an API key. */
export function isAIConfigured(): boolean {
  return resolveProvider() !== null;
}

export function describeAIProvider(): { provider: AIProvider; model: string } | null {
  const c = resolveProvider();
  return c ? { provider: c.provider, model: c.model } : null;
}

/**
 * Single entry point for any AI completion. Returns null if no provider is
 * configured — callers should fall back to their hardcoded path.
 */
export async function aiComplete(req: AIRequest): Promise<AIResult | null> {
  const cfg = resolveProvider();
  if (!cfg) return null;

  try {
    if (cfg.provider === 'anthropic') {
      return await callAnthropic(cfg, req);
    }
    // DeepSeek + OpenAI both use the OpenAI Chat Completions shape.
    return await callOpenAICompat(cfg, req);
  } catch (err) {
    console.error(`[ai] ${cfg.provider} call failed:`, err);
    return null;
  }
}

async function callOpenAICompat(cfg: ProviderConfig, req: AIRequest): Promise<AIResult> {
  const client = new OpenAI({ apiKey: cfg.apiKey, baseURL: cfg.baseURL });

  const messages: OpenAI.ChatCompletionMessageParam[] = [];
  if (req.system) messages.push({ role: 'system', content: req.system });
  for (const m of req.messages) messages.push({ role: m.role, content: m.content });

  const response = await client.chat.completions.create({
    model: cfg.model,
    max_tokens: req.maxTokens ?? 1024,
    temperature: req.temperature,
    messages,
    response_format: req.responseFormat === 'json' ? { type: 'json_object' } : undefined,
  });

  const text = response.choices[0]?.message?.content ?? '';
  return { text, provider: cfg.provider, model: cfg.model };
}

async function callAnthropic(cfg: ProviderConfig, req: AIRequest): Promise<AIResult> {
  const anthropic = new Anthropic({ apiKey: cfg.apiKey });

  // Anthropic doesn't accept system in messages — it's a separate param.
  // If caller asks for JSON, we coerce by appending a strict instruction to system.
  const system =
    req.responseFormat === 'json'
      ? `${req.system ?? ''}\n\nReturn ONLY a valid JSON object. No prose, no markdown fences.`
      : req.system;

  const response = await anthropic.messages.create({
    model: cfg.model,
    max_tokens: req.maxTokens ?? 1024,
    temperature: req.temperature,
    ...(system ? { system } : {}),
    messages: req.messages.map((m) => ({
      role: m.role === 'system' ? 'user' : m.role,
      content: m.content,
    })),
  });

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => ('text' in b ? b.text : ''))
    .join('\n');
  return { text, provider: cfg.provider, model: cfg.model };
}
