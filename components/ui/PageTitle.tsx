interface PageTitleProps {
  title: string;
  subtitle?: React.ReactNode;
}

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <>
      <h1 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] mb-1.5">
        {title}
      </h1>
      {subtitle && <p className="text-[13px] text-text-muted mb-6 max-w-[640px]">{subtitle}</p>}
    </>
  );
}
