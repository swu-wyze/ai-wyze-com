// Parses Claude/DeepSeek's plain-marker text into renderable blocks.
// Markers supported:
//   **bold** / *italic*
//   [THINKING]reasoning preamble[/THINKING]   — purple-tinted reasoning shown before the answer
//   [CARD type="recommended|option|action"]Title: X\nPrice: Y\nNote: Z[/CARD]
//   [BARS]\nlabel | amount | widthPct | highlight\n...[/BARS]
//   [PRODUCT: <catalog slug>]                  — inline product card (image + name + price + Add to cart)
//   [ACTION: Label]                            — primary action button (cart-eligible labels add to cart)
//   [CHIP: Label]                              — quick-reply pill (sends label as the user's next message)
//
// All blocks are siblings rendered in order. ACTION and CHIP runs collapse
// into single rows so the buttons sit together.

export type Block =
  | { kind: 'text'; content: string }
  | { kind: 'thinking'; content: string }
  | { kind: 'card'; cardType: 'recommended' | 'option' | 'action'; title?: string; price?: string; note?: string }
  | { kind: 'bars'; rows: { label: string; amount: string; widthPct: number; highlight: boolean }[] }
  | { kind: 'product'; slug: string }
  | { kind: 'actions'; actions: string[] }
  | { kind: 'chips'; chips: string[] };

const PATTERN =
  /(\[THINKING\][\s\S]*?\[\/THINKING\])|(\[CARD type="(recommended|option|action)"\][\s\S]*?\[\/CARD\])|(\[BARS\][\s\S]*?\[\/BARS\])|(\[PRODUCT:\s*[^\]]+\])|(\[ACTION:\s*[^\]]+\])|(\[CHIP:\s*[^\]]+\])/g;

export function parseAssistantMessage(text: string): Block[] {
  const blocks: Block[] = [];
  let cursor = 0;
  const pendingActions: string[] = [];
  const pendingChips: string[] = [];

  const flushText = (raw: string) => {
    const trimmed = raw.replace(/\n{3,}/g, '\n\n').trim();
    if (trimmed.length > 0) blocks.push({ kind: 'text', content: trimmed });
  };

  // Drain action/chip queues into block runs the moment another marker type
  // appears, so the visual order matches the marker order.
  const flushPending = () => {
    if (pendingActions.length > 0) {
      blocks.push({ kind: 'actions', actions: [...pendingActions] });
      pendingActions.length = 0;
    }
    if (pendingChips.length > 0) {
      blocks.push({ kind: 'chips', chips: [...pendingChips] });
      pendingChips.length = 0;
    }
  };

  for (const match of text.matchAll(PATTERN)) {
    const fullMatch = match[0];
    const idx = match.index ?? 0;
    if (idx > cursor) {
      flushPending();
      flushText(text.slice(cursor, idx));
    }

    if (match[1]) {
      // THINKING
      flushPending();
      const body = fullMatch.replace(/^\[THINKING\]/, '').replace(/\[\/THINKING\]$/, '').trim();
      blocks.push({ kind: 'thinking', content: body });
    } else if (match[2]) {
      // CARD
      flushPending();
      const cardType = match[3] as 'recommended' | 'option' | 'action';
      const body = fullMatch.replace(/^\[CARD[^\]]*\]/, '').replace(/\[\/CARD\]$/, '').trim();
      const title = /Title:\s*(.+)/.exec(body)?.[1]?.trim();
      const price = /Price:\s*(.+)/.exec(body)?.[1]?.trim();
      const note = /Note:\s*(.+)/.exec(body)?.[1]?.trim();
      blocks.push({ kind: 'card', cardType, title, price, note });
    } else if (match[4]) {
      // BARS
      flushPending();
      const body = fullMatch.replace(/^\[BARS\]/, '').replace(/\[\/BARS\]$/, '').trim();
      const rows = body
        .split('\n')
        .map((line) => line.split('|').map((s) => s.trim()))
        .filter((parts) => parts.length === 4)
        .map(([label, amount, widthPct, highlight]) => ({
          label,
          amount,
          widthPct: Number(widthPct) || 0,
          highlight: highlight === 'true',
        }));
      blocks.push({ kind: 'bars', rows });
    } else if (match[5]) {
      // PRODUCT
      flushPending();
      const slug = fullMatch.replace(/^\[PRODUCT:\s*/, '').replace(/\]$/, '').trim();
      blocks.push({ kind: 'product', slug });
    } else if (match[6]) {
      const label = fullMatch.replace(/^\[ACTION:\s*/, '').replace(/\]$/, '').trim();
      pendingActions.push(label);
    } else if (match[7]) {
      const label = fullMatch.replace(/^\[CHIP:\s*/, '').replace(/\]$/, '').trim();
      pendingChips.push(label);
    }

    cursor = idx + fullMatch.length;
  }

  if (cursor < text.length) flushText(text.slice(cursor));
  flushPending();

  return blocks;
}

export function renderInline(text: string): (string | { bold?: string; italic?: string })[] {
  const out: (string | { bold?: string; italic?: string })[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    if (m[2] !== undefined) out.push({ bold: m[2] });
    else if (m[3] !== undefined) out.push({ italic: m[3] });
    last = idx + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
