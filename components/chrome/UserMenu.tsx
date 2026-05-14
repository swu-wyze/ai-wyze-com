'use client';

import { useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { signOutAction } from '@/app/actions/auth';
import type { User } from '@/lib/types';

export function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center text-[11px] font-semibold text-white hover:scale-105 transition-transform"
        aria-label="Account menu"
      >
        {user.initial}
      </button>

      {open && (
        <div className="absolute right-0 top-[36px] w-[220px] bg-bg-elevated border border-faint rounded-xl shadow-lg overflow-hidden z-[200]">
          <div className="px-4 py-3 border-b border-faint">
            <div className="text-[13px] font-semibold text-text-primary">{user.name}</div>
            <div className="text-[11px] text-text-faint">{user.location}</div>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full px-4 py-2.5 flex items-center gap-2 text-[12.5px] text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
