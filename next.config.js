const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = withNextIntl({
  reactStrictMode: false, // Disable React Strict Modecd
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kdbxq6eseiqtwhzx.public.blob.vercel-storage.com', // Vercel's blob URL
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub's avatar URL
      },
      {
        protocol: 'https',
        hostname: 'cdn.intra.42.fr', // 42's avatar URL
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google's avatar URL
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
});

module.exports = nextConfig;
