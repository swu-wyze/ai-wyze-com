import { NextResponse } from 'next/server';

/**
 * Returns the git SHA and build timestamp baked in at build time. Lets us
 * verify which commit is actually running on the deployed container vs what's
 * on `main` — useful when deploys aren't visibly reflecting source changes.
 *
 * Both values are injected as env vars in the Dockerfile (BUILD_SHA, BUILD_AT).
 */
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    sha: process.env.BUILD_SHA ?? 'unknown',
    builtAt: process.env.BUILD_AT ?? 'unknown',
    landingRewriteWired: true, // hardcoded — if you can GET this, the latest config is live
  });
}
