interface Props {
  imageSrc: string;
  imageAlt?: string;
  because?: string;
  becauseVariant?: 'green' | 'purple';
  name: string;
  price: string;
  strikePrice?: string;
  badge?: string;
  imageHeight?: number;
  /** Light vs dark behind the product. Wyze product photos are shot on near-white;
   *  we mirror that on both themes so the products always read crisply. */
  imageBg?: 'neutral' | 'light';
}

export function ProductCard({
  imageSrc,
  imageAlt,
  because,
  becauseVariant = 'green',
  name,
  price,
  strikePrice,
  badge,
  imageHeight = 200,
  imageBg = 'light',
}: Props) {
  return (
    <div className="bg-surface-1 rounded-[10px] overflow-hidden hover:bg-surface-2 hover:-translate-y-0.5 transition-all cursor-pointer">
      <div
        className={`relative flex items-center justify-center ${
          imageBg === 'light' ? 'bg-[#f4f4f4]' : 'bg-black/20'
        }`}
        style={{ height: imageHeight }}
      >
        <img
          src={imageSrc}
          alt={imageAlt ?? name}
          className="max-h-[85%] max-w-[80%] object-contain"
          loading="lazy"
        />
        {badge && (
          <span className="absolute top-3 right-3 text-[9px] font-semibold tracking-[1px] px-2 py-1 rounded bg-wyze-green text-[#0a0a0a]">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        {because && (
          <div
            className={`text-[9px] font-semibold tracking-[1.5px] uppercase mb-2 ${
              becauseVariant === 'purple' ? 'text-accent-purple' : 'text-wyze-green'
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
