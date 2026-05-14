/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async rewrites() {
    return [
      // Owen's pre-auth landing (static HTML in /public/wyzeai.html) is the
      // public homepage. Its CTAs link into /digest, which is gated by the
      // (home) layout and bounces unauthenticated users to /login.
      { source: '/', destination: '/wyzeai.html' },
    ];
  },
};

export default nextConfig;
