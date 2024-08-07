const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin(
  // custom path (default is '.src/i18n'):
  './i18n.ts'
);

const nextConfig = withNextIntl({
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
