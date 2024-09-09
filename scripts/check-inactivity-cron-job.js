require('dotenv').config();
const cron = require('node-cron');
const fetch = require('node-fetch');

const hostname = process.env.NEXT_PUBLIC_HOSTNAME || 'localhost';
const port = process.env.NEXT_PUBLIC_PORT || 6969;

// Schedule a task to run every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  try {
    console.log('Checking user inactivity...');
    const response = await fetch(`http://${hostname}:${port}/api/check-inactivity`);
    //const response = await fetch(`https://matcha-find-your-date.vercel.app/api/check-inactivity`);

    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error('Error checking inactivity:', error);
  }
});
