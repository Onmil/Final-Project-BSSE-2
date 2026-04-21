const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');
const bcrypt = require('bcrypt');

const USERS_TABLE = process.env.SUPABASE_USERS_TABLE || 'users';


// signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email, and password are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data: existing, error: findError } = await supabase
      .from(USERS_TABLE)
      .select('id')
      .eq('email', normalizedEmail);

    if (findError) {
      console.error('SIGNUP FIND ERROR:', findError);
      return res.status(500).json({ error: findError.message });
    }

    if (existing && existing.length > 0) {
      return res.status(409).json({
        error: 'Email already registered.'
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // insert user
    const { data: inserted, error: insertError } = await supabase
      .from(USERS_TABLE)
      .insert([
        {
          name: name.trim(),
          email: normalizedEmail,
          password_hash
        }
      ])
      .select('id, name, email');

    if (insertError) {
      console.error('SIGNUP INSERT ERROR:', insertError);
      return res.status(500).json({ error: insertError.message });
    }

    if (!inserted || inserted.length === 0) {
      return res.status(500).json({ error: 'User not created.' });
    }

    return res.status(200).json(inserted[0]);

  } catch (err) {
    console.error('SIGNUP UNEXPECTED ERROR:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // fetch user
    const { data: users, error: findError } = await supabase
      .from(USERS_TABLE)
      .select('*')
      .eq('email', normalizedEmail);

    if (findError) {
      console.error('LOGIN FIND ERROR:', findError);
      return res.status(500).json({ error: findError.message });
    }

    if (!users || users.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.error('LOGIN UNEXPECTED ERROR:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;