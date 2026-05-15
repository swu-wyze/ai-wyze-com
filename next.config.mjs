/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async rewrites() {
    return [
      // Root still serves the static HTML landing during the Next.js migration.
      // The new TSX landing lives at /landing — once verified, we'll swap / to
      // the Next route and delete public/wyzeai.html.
      { source: '/', destination: '/wyzeai.html' },
    ];
  },
};

export default nextConfig;
