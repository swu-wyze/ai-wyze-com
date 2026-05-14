type Variant = 'doorbell' | 'floodlight' | 'lock' | 'shield' | 'cam' | 'sensor' | 'router';

interface Props {
  variant: Variant;
  className?: string;
}

export function ProductIllustration({ variant, className = '' }: Props) {
  switch (variant) {
    case 'doorbell':
      return (
        <svg className={className} width="64" height="114" viewBox="0 0 64 114" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="7" y="7" width="50" height="100" rx="9" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1" />
          <circle cx="32" cy="36" r="15" fill="#0a0a0a" stroke="#1DF0BB" strokeWidth="1.5" />
          <circle cx="32" cy="36" r="7" fill="#1a1a1a" />
          <circle cx="32" cy="36" r="3" fill="#1DF0BB" />
          <circle cx="32" cy="82" r="10" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
          <circle cx="32" cy="82" r="4" fill="#0a0a0a" />
        </svg>
      );
    case 'floodlight':
      return (
        <svg className={className} width="120" height="90" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="12" y="44" width="96" height="26" rx="5" fill="#2a2a2a" stroke="#3a3a3a" />
          <rect x="16" y="48" width="26" height="18" rx="2" fill="#1DF0BB" opacity="0.85" />
          <rect x="46" y="48" width="26" height="18" rx="2" fill="#1DF0BB" opacity="0.85" />
          <rect x="76" y="48" width="28" height="18" rx="2" fill="#1a1a1a" stroke="#3a3a3a" />
          <circle cx="90" cy="57" r="5" fill="#0a0a0a" stroke="#1DF0BB" strokeWidth="1" />
          <rect x="54" y="70" width="10" height="18" fill="#2a2a2a" />
        </svg>
      );
    case 'lock':
      return (
        <svg className={className} width="80" height="104" viewBox="0 0 80 104" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="12" y="14" width="56" height="76" rx="9" fill="#2a2a2a" stroke="#3a3a3a" />
          <circle cx="40" cy="40" r="16" fill="#0a0a0a" stroke="#1DF0BB" strokeWidth="1.5" />
          <rect x="36" y="36" width="8" height="8" rx="1" fill="#1DF0BB" />
          <rect x="22" y="64" width="36" height="16" rx="3" fill="#1a1a1a" />
          <rect x="28" y="68" width="24" height="8" rx="1" fill="#0a0a0a" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={className} width="80" height="90" viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path
            d="M40 8 L66 18 L66 46 C66 64 54 78 40 82 C26 78 14 64 14 46 L14 18 Z"
            fill="rgba(184,196,255,0.15)"
            stroke="#B8C4FF"
            strokeWidth="1.5"
          />
          <path d="M30 44 L37 52 L52 36" stroke="#B8C4FF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'cam':
      return (
        <svg className={className} width="68" height="68" viewBox="0 0 68 68" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="9" y="16" width="50" height="36" rx="6" fill="#2a2a2a" stroke="#3a3a3a" />
          <circle cx="34" cy="34" r="12" fill="#0a0a0a" stroke="#1DF0BB" strokeWidth="1.5" />
          <circle cx="34" cy="34" r="5" fill="#1DF0BB" />
        </svg>
      );
    case 'sensor':
      return (
        <svg className={className} width="68" height="68" viewBox="0 0 68 68" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="34" cy="34" r="22" fill="#2a2a2a" stroke="#3a3a3a" />
          <circle cx="34" cy="34" r="16" fill="#0a0a0a" />
          <path d="M25 34 L31 41 L43 27" stroke="#1DF0BB" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'router':
      return (
        <svg className={className} width="80" height="68" viewBox="0 0 80 68" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="16" y="20" width="48" height="32" rx="5" fill="#2a2a2a" stroke="#3a3a3a" />
          <circle cx="26" cy="36" r="2.5" fill="#1DF0BB" />
          <circle cx="40" cy="36" r="2.5" fill="#1DF0BB" />
          <circle cx="54" cy="36" r="2.5" fill="#1DF0BB" />
          <path d="M40 16 Q40 10, 32 10 M40 16 Q40 10, 48 10" stroke="#3a3a3a" strokeWidth="1" fill="none" />
        </svg>
      );
  }
}
