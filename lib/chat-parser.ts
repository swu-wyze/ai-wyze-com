// Parses Claude's (or the scripted fallback's) plain-marker text into
// renderable blocks. Markers supported:
//   **bold**
//   *italic*
//   [CARD type="recommended|option|action"]Title: X\nPrice: Y\nNote: Z[/CARD]
//   [BARS]\nlabel | amount | widthPct | highlight\n...[/BARS]
//   [ACTION: Label]
//
// The shape stays flat — paragraphs, cards, bars, and actions are all sibling
// blocks rendered in the order they appear.

export type Block =
  | { kind: 'text'; content: string }
  | { kind: 'card'; cardType: 'recommended' | 'option' | 'action'; title?: string; price?: string; note?: string }
  | { kind: 'bars'; rows: { label: string; amount: string; widthPct: number; highlight: boolean }[] }
  | { kind: 'actions'; actions: string[] };

export function parseAssistantMessage(text: string): Block[] {
  const blocks: Block[] = [];
  const pattern = /(\[CARD type="(recommended|option|action)"\][\s\S]*?\[\/CARD\])|(\[BARS\][\s\S]*?\[\/BARS\])|(\[ACTION: [^\]]+\])/g;

  let cursor = 0;
  const pendingActions: string[] = [];

  const flushText = (raw: string) => {
    const trimmed = raw.replace(/\n{3,}/g, '\n\n').trim();
    if (trimmed.length > 0) {
      blocks.push({ kind: 'text', content: trimmed });
    }
  };

  for (const match of text.matchAll(pattern)) {
    const fullMatch = match[0];
    const idx = match.index ?? 0;
    if (idx > cursor) flushText(text.slice(cursor, idx));

    if (match[1]) {
      // CARD
      const cardType = match[2] as 'recommended' | 'option' | 'action';
      const body = fullMatch.replace(/^\[CARD[^\]]*\]/, '').replace(/\[\/CARD\]$/, '').trim();
      const title = /Title:\s*(.+)/.exec(body)?.[1]?.trim();
      const price = /Price:\s*(.+)/.exec(body)?.[1]?.trim();
      const note = /Note:\s*(.+)/.exec(body)?.[1]?.trim();
      blocks.push({ kind: 'card', cardType, title, price, note });
    } else if (match[3]) {
      // BARS
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
    } else if (match[4]) {
      // ACTION — accumulate so consecutive ones render as one button row
      const label = fullMatch.replace(/^\[ACTION:\s*/, '').replace(/\]$/, '').trim();
      pendingActions.push(label);
    }

    cursor = idx + fullMatch.length;
  }

  if (cursor < text.length) flushText(text.slice(cursor));
  if (pendingActions.length > 0) blocks.push({ kind: 'actions', actions: pendingActions });

  return blocks;
}

// Inline markdown: **bold** and *italic*. Returns React-friendly nodes.
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
