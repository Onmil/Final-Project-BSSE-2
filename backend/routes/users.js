// backend/routes/users.js
const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');
const bcrypt = require('bcrypt');

const USERS_TABLE = process.env.SUPABASE_USERS_TABLE || 'users';
const inMemoryUsers = [];
const hasSupabaseConfig = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_KEY);

async function findUserByEmail(email) {
    if (!hasSupabaseConfig) {
        return { data: inMemoryUsers.find((u) => u.email === email) || null, error: null };
    }

    const { data, error } = await supabase
        .from(USERS_TABLE)
        .select('*')
        .eq('email', email);

    return { data: data && data.length > 0 ? data[0] : null, error };
}

async function addUser(user) {
    if (!hasSupabaseConfig) {
        const fakeUser = { id: crypto.randomUUID(), ...user }; // fallback ID
        inMemoryUsers.push(fakeUser);
        return { data: fakeUser, error: null };
    }

    const { data, error } = await supabase
        .from(USERS_TABLE)
        .insert([user])
        .select();

    return { data: data ? data[0] : null, error };
}

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase();
    const { data: existingUser, error: findError } = await findUserByEmail(normalizedEmail);

    if (findError) return res.status(500).json({ error: findError.message });
    if (existingUser) return res.status(409).json({ error: 'Email already registered.' });

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = { name: name.trim(), email: normalizedEmail, password_hash };

    const { data, error: createError } = await addUser(newUser);
    if (createError || !data) {
        return res.status(500).json({ error: createError?.message || 'Could not create user.' });
    }

    // ✅ INCLUDE ID
    res.json({
        id: data.id,
        name: data.name,
        email: data.email
    });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required.' });
    }

    const normalizedEmail = email.toLowerCase();
    const { data: user, error: findError } = await findUserByEmail(normalizedEmail);

    if (findError) return res.status(500).json({ error: findError.message });
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

    console.log("LOGIN USER:", user); //temportary, check if id is present

    // ✅ INCLUDE ID
    res.json({
        id: user.id,
        name: user.name,
        email: user.email
    });
});

module.exports = router;