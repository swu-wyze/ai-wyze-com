import type { ReactNode } from 'react';

interface Props {
  illustration: ReactNode;
  because?: string;
  becauseVariant?: 'green' | 'purple';
  name: string;
  price: string;
  strikePrice?: string;
  badge?: string;
  imageHeight?: number;
}

export function ProductCard({
  illustration,
  because,
  becauseVariant = 'green',
  name,
  price,
  strikePrice,
  badge,
  imageHeight = 180,
}: Props) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.05] rounded-[10px] overflow-hidden hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all cursor-pointer">
      <div
        className="relative flex items-center justify-center bg-black/30 border-b border-white/[0.04]"
        style={{ height: imageHeight }}
      >
        {illustration}
        {badge && (
          <span className="absolute top-3 right-3 text-[9px] font-semibold tracking-[1px] px-2 py-1 rounded bg-wyze-green text-bg-base">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        {because && (
          <div
            className={`text-[9px] font-semibold tracking-[1.5px] uppercase mb-2 ${
              becauseVariant === 'purple' ? 'text-wyze-purple-light' : 'text-wyze-green'
            }`}
          >
            {because}
          </div>
        )}
        <div className="text-[14px] font-semibold mb-1.5">{name}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] font-semibold tabular-nums">{price}</span>
          {strikePrice && <span className="text-[10px] text-text-faint line-through tabular-nums">{strikePrice}</span>}
        </div>
      </div>
    </div>
  );
}
