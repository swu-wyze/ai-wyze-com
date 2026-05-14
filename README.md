# Wyze Home OS

> An AI-native logged-in experience for wyze.com — repositioning the site from hardware storefront to an operating system for the home. Built for the Wyze internal hackathon.

**Pitch in one breath:** Wyze.com today is a store. We're proposing it become an operating system for your home — where managing, understanding, and discovering all live in one intelligent surface. Commerce isn't a destination anymore; it's a recommendation your home makes.

## Quick start

```bash
# 1. Install dependencies
npm install        # or pnpm install / bun install

# 2. (Optional) Drop in your Anthropic API key for real Claude in the chat strip
cp .env.example .env.local
# edit .env.local → ANTHROPIC_API_KEY=sk-ant-...

# 3. Run
npm run dev
```

Open <http://localhost:3000>. You'll land on `/digest`.

### Chat strip behavior

The chat strip works **with or without** an API key.

- **With `ANTHROPIC_API_KEY` set** — every message hits real Claude (claude-sonnet-4-6 by default; override via `ANTHROPIC_MODEL`) with Sunny's home injected as the system prompt. Responses can use `**bold**`, `[CARD type="recommended|option|action"]…[/CARD]`, `[BARS]…[/BARS]`, and `[ACTION: Label]` markers — the frontend parses and renders all four.
- **Without a key (or on API error)** — the server action falls back to a scripted response that matches one of five demo scenarios (or a helpful fallback). Scripted responses use the same marker shape as real Claude, so the UI looks identical either way.

The five demo scenarios are in `lib/chat-script.ts`. Triggers are keyword-based (e.g. "cheapest", "earning", "nursery", "doorbell", "compare").

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
