// Make all environment variables available in the entire application.
const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${env.trim()}` });
