// CommonJS module:
require('dotenv').config();

const { execSync } = require('child_process');

const port = process.env.NEXT_PUBLIC_PORT || 6969;
execSync(`cross-env PORT=${port} next dev`, { stdio: 'inherit' });
