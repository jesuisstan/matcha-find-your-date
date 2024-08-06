const nextTranslate = require('next-translate-plugin');

const nextConfig = nextTranslate({
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
});

module.exports = nextConfig;
