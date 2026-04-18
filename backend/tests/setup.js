const path = require('path');

process.env.NODE_ENV = 'test';

require('dotenv').config({
  path: path.resolve(__dirname, '../.env.test'),
});

console.log('ENV:', process.env.NODE_ENV);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'loaded' : 'MISSING');
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'loaded' : 'MISSING');