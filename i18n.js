module.exports = {
  locales: ['en', 'fr', 'ru'],
  defaultLocale: 'en',
  logBuild: process.env.NODE_ENV !== 'production',
  pages: {
    '*': ['common'],
    // DASHBOARD
    '/(dashboard)/dashboard': ['dashboard'],
  },
};
