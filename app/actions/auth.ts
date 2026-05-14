'use server';

import { redirect } from 'next/navigation';
import { clearSession, setSession } from '@/lib/auth';
import { isValidUserId, USER_CREDENTIALS } from '@/lib/users';

interface SignInState {
  error: string | null;
}

export async function signInAction(
  _prev: SignInState,
  formData: FormData
): Promise<SignInState> {
  const username = String(formData.get('username') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!username || !password) {
    return { error: 'Username and password are required.' };
  }
  if (!isValidUserId(username)) {
    return { error: 'Unknown username. Try owen, bob, or sunny.' };
  }
  if (USER_CREDENTIALS[username] !== password) {
    return { error: 'Wrong password.' };
  }

  await setSession(username);
  redirect('/digest');
}

export async function signOutAction(): Promise<void> {
  await clearSession();
  redirect('/login');
}
