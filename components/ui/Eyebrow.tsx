interface EyebrowProps {
  children: React.ReactNode;
  variant?: 'green' | 'muted' | 'purple';
  className?: string;
}

export function Eyebrow({ children, variant = 'green', className = '' }: EyebrowProps) {
  const color =
    variant === 'green' ? 'text-wyze-green' :
    variant === 'purple' ? 'text-wyze-purple-light' :
    'text-text-faint';
  return (
    <div className={`text-[10px] font-semibold tracking-[1.5px] uppercase ${color} ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-[10px] font-semibold tracking-[1.5px] uppercase text-text-faint mb-3 ${className}`}>
      {children}
    </div>
  );
}
