'use client';

import { useActionState } from 'react';
import { signInAction } from '@/app/actions/auth';

export function LoginForm() {
  const [state, action, pending] = useActionState(signInAction, { error: null });

  return (
    <form action={action} className="bg-surface-1 border border-faint rounded-2xl p-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold tracking-[1.5px] uppercase text-text-faint">Username</span>
        <input
          name="username"
          type="text"
          autoFocus
          autoComplete="username"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="owen / bob / sunny"
          className="bg-surface-2 border border-faint rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-wyze-green/60 focus:bg-surface-2 transition-colors placeholder:text-text-faint"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold tracking-[1.5px] uppercase text-text-faint">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="123456"
          className="bg-surface-2 border border-faint rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-wyze-green/60 focus:bg-surface-2 transition-colors placeholder:text-text-faint"
        />
      </label>

      {state.error && (
        <div className="text-[12.5px] text-red-500 bg-red-500/[0.08] border border-red-500/20 rounded-md px-3 py-2">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 bg-wyze-green text-[#0a0a0a] px-4 py-2.5 rounded-lg font-semibold text-[13px] hover:bg-[#4dffd0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
