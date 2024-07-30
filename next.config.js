const nextTranslate = require('next-translate-plugin');

const nextConfig = nextTranslate({
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'q3-prod-macro.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'q3-dev-it-cms.s3.eu-west-3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'q3-techno-dev.s3.amazonaws.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
});

module.exports = nextConfig;
