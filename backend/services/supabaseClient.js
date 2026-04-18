const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    db: {
      schema: process.env.DB_SCHEMA || 'public'
    }
  }
);

module.exports = supabase;