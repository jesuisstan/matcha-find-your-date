module.exports = {
  locales: ['en', 'fr', 'ru'],
  defaultLocale: 'en',
  logBuild: process.env.NODE_ENV !== 'production',
  pages: {
    '*': ['common'],
    // DASHBOARD
    '/(dashboard)/dashboard': ['dashboard'],
    // SMARTDATA MACRO
    '/(dashboard)/smartdata/(macro)/manufacturing-nowcast': ['smartdata', 'countries'],
  },
};
