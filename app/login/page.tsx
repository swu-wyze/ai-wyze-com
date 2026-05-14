import { redirect } from 'next/navigation';
import { getCurrentUserId } from '@/lib/auth';
import { BrandLogo } from '@/components/chrome/BrandLogo';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  // Already signed in? Bounce to dashboard.
  const userId = await getCurrentUserId();
  if (userId) redirect('/digest');

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bg-base">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center text-center mb-8">
          <BrandLogo size="lg" sloganMobileHidden={false} className="mb-6" />
          <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-text-primary">
            Sign in to your home
          </h1>
          <p className="text-[13px] text-text-muted mt-2">
            Demo accounts: <span className="font-medium text-text-secondary">owen</span> ·{' '}
            <span className="font-medium text-text-secondary">bob</span> ·{' '}
            <span className="font-medium text-text-secondary">sunny</span> &nbsp;·&nbsp; password{' '}
            <span className="font-medium text-text-secondary">123456</span>
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
