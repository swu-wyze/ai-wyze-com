interface Row {
  name: string;
  amount: string;
  widthPct: number;
  highlight?: boolean;
}

export function BarComparison({ rows }: { rows: Row[] }) {
  return (
    <div className="w-full">
      {rows.map((row, i) => (
        <div key={row.name} className={i === rows.length - 1 ? '' : 'mb-3'}>
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className={row.highlight ? 'text-wyze-green font-semibold' : 'text-text-secondary'}>{row.name}</span>
            <span className={row.highlight ? 'text-wyze-green font-semibold tabular-nums' : 'text-text-muted tabular-nums'}>
              {row.amount}
            </span>
          </div>
          <div className="bg-white/[0.08] rounded h-2.5 overflow-hidden">
            <div
              className={`h-full rounded transition-[width] duration-700 ease-out ${
                row.highlight ? 'bg-wyze-green' : 'bg-text-muted/70'
              }`}
              style={{ width: `${row.widthPct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
