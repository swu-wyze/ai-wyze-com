interface Props {
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the "Never Wonder" slogan next to the mark. */
  showSlogan?: boolean;
  /** On mobile only show the mark; render the slogan from sm: up. Default true. */
  sloganMobileHidden?: boolean;
  className?: string;
}

/**
 * The Wyze brand mark (gradient "W" tile) + "Never Wonder" slogan. Used in
 * TopNav, on the login screen, and anywhere else the brand needs to anchor.
 *
 * Expects `public/wyze-logo.png` (the dark rounded-tile mark) to exist.
 * Replace that file to refresh the brand without code changes.
 */
export function BrandLogo({
  size = 'md',
  showSlogan = true,
  sloganMobileHidden = true,
  className = '',
}: Props) {
  const sizes = {
    sm: { mark: 32, slogan: 'text-[13px]', gap: 'gap-2.5' },
    md: { mark: 44, slogan: 'text-[15px]', gap: 'gap-3' },
    lg: { mark: 72, slogan: 'text-[19px]', gap: 'gap-3.5' },
  } as const;
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      <img
        src="/wyze-logo.png"
        alt="Wyze"
        className="rounded-lg shrink-0"
        style={{ width: s.mark, height: s.mark }}
      />
      {showSlogan && (
        <span
          className={`${s.slogan} font-bold tracking-[-0.01em] whitespace-nowrap bg-brand-gradient bg-clip-text text-transparent ${
            sloganMobileHidden ? 'hidden sm:inline' : ''
          }`}
        >
          Never Wonder
        </span>
      )}
    </div>
  );
}
