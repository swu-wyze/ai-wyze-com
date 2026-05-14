# Wyze Home OS

> An AI-native logged-in experience for wyze.com — repositioning the site from hardware storefront to an operating system for the home. Built for the Wyze internal hackathon.

**Pitch in one breath:** Wyze.com today is a store. We're proposing it become an operating system for your home — where managing, understanding, and discovering all live in one intelligent surface. Commerce isn't a destination anymore; it's a recommendation your home makes.

## Quick start

```bash
# 1. Install dependencies
npm install        # or pnpm install / bun install

# 2. (Optional) Wire up an AI provider — DeepSeek by default
cp .env.example .env.local
# edit .env.local → AI_API_KEY=<your DeepSeek key>

# 3. Run
npm run dev
```

Open <http://localhost:3000>. You'll land on `/login` — sign in as `owen`, `bob`, or `sunny` with password `123456`.

### AI provider

All AI calls funnel through [`lib/ai.ts`](lib/ai.ts), which is provider-agnostic. Configure via env:

| Var            | Default                                            | Notes                                                |
|----------------|----------------------------------------------------|------------------------------------------------------|
| `AI_PROVIDER`  | `deepseek`                                         | `deepseek` · `openai` · `anthropic`                  |
| `AI_API_KEY`   | _(empty)_                                          | Required for live AI. Empty → hardcoded fallback.   |
| `AI_MODEL`     | provider-default (deepseek-chat / gpt-4o-mini / …) | Override to swap models within a provider.          |
| `AI_BASE_URL`  | provider-default                                   | Override for OpenAI-compatible gateways (Groq, etc.) |

Three places use AI:
1. **Chat** ([`app/actions/chat.ts`](app/actions/chat.ts)) — every user message → tailored response, using the home as system prompt.
2. **Agent's opening briefing** ([`lib/agent-opening.ts`](lib/agent-opening.ts)) — generated when a user lands. Cached per user for 30 min.
3. **"Built around your home" recommendations** ([`lib/recommendations.ts`](lib/recommendations.ts)) — AI picks 3 products from [`lib/product-catalog.ts`](lib/product-catalog.ts) using the user's fleet. Cached per user.

**Without an `AI_API_KEY`**, all three fall back to deterministic hardcoded content per user (Owen / Bob / Sunny), so the demo always works.

## The 60-second demo

1. **Open `/digest`.** Two layers visible: the agent rail on the left has already briefed you ("Welcome back, Sunny — since Sunday…") with three cards — Cam Unlimited math, Nursery alert, 4 packages at door. The page itself is the data layer: fleet at a glance, this week's numbers, then personalized product recommendations tied to her fleet (Doorbell for the 4 packages, Floodlight for after-dark Backyard, Lock to complete the front door).
2. **Click *"Try Cam Unlimited free for 14 days"*** in the agent's opening → the rail expands into focus mode, the live cart canvas slides in showing the running ledger.
3. **Type *"Which of my cameras isn't earning its keep?"*** — the **honesty move**: recommends a $0 license reassignment (Living Room → Backyard), not an upsell.
4. **Click `Plans`.** Three-option upgrade simulator with Cam Unlimited highlighted.

## Stack

- Next.js 15 (App Router) + TypeScript strict
- Tailwind CSS + Wyze design tokens (`tailwind.config.ts`, `app/globals.css`)
- Anthropic SDK — server-only via `app/actions/chat.ts`
- Lucide React icons
- Node 20+

## Project layout

```
app/
  (home)/
    digest/         Adaptive briefing + insights + personalized product recs
    cameras/        2×2 grid with per-camera AI strips
    events/         Day-grouped timeline with flagged events
    plans/          Current plan + 3-option upgrade simulator
    layout.tsx      OS chrome wrapper (provides ChatRail context)
  actions/
    chat.ts         Server action: real Claude OR scripted fallback
components/
  chrome/           TopNav, SecondaryNav, FleetRibbon, ChatRail
  chat/             AssistantContent, CartPanel, ChatRailContext
  surfaces/         Per-surface composition
  ui/               Eyebrow, PageTitle, BarComparison, ProductCard, etc.
lib/
  home-data.ts      Sunny's home — single source of truth
  plans-catalog.ts  Plan pricing
  chat-context.ts   System prompt builder
  chat-script.ts    Scripted demo responses
  chat-parser.ts    Marker → block parser
  types.ts          All shapes
```

## Deploy — Wyze Coolify (SSO-protected)

Per Wyze policy this is a dynamic app, so deployment goes through security review.

1. **Open a security review ticket** with the Wyze security team. Reference: app calls api.anthropic.com only; no Wyze customer data stored; deploys behind JumpCloud SSO.
2. After approval, deploy via the Wyze deploy connector to `coolify.ops777.com`.
3. In Coolify, set `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`) as build-time secrets.
4. JumpCloud SSO protects the URL automatically — only Wyze accounts can access.

### Docker build (used by Coolify)

```bash
docker build -t wyze-home-os .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY wyze-home-os
```

The Dockerfile is a three-stage build that produces a Node 20 Alpine image with the Next.js standalone output (~150 MB). It supports npm or pnpm lockfiles transparently.

## Stage A vs Stage B

Stage A (this build) hard-codes one fictional Super User ("Sunny") and ships all five surfaces + the chat. Stage B (post-hackathon, if green-lit) wires real auth, real fleet data, real action execution. Architecture is designed for that swap — `getHome()` is the single seam.
