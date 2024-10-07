const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = withNextIntl({
  reactStrictMode: false, // Disable React Strict Modecd
  images: {
    domains: ['kdbxq6eseiqtwhzx.public.blob.vercel-storage.com'],
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
});

module.exports = nextConfig;
