const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');

// POST booking
router.post('/', async (req, res) => {
  const {
    user_id,
    tour_id,
    booking_date,
    full_name,
    email,
    phone,
    persons,
    status,
  } = req.body;

  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        user_id,
        tour_id,
        booking_date,
        full_name,
        email,
        phone,
        persons,
        status,
      },
    ])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// GET all bookings
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

module.exports = router;