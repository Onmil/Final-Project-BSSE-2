const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');

// POST booking
router.post('/', async (req, res) => {
  const {
    tour_id,
    booking_date,
    full_name,
    email,
    phone,
    persons,
    status,
    payment_method,
    user_uuid, // <-- optional: pass logged-in user's UUID from Supabase Auth
  } = req.body;

  try {
    // Insert booking
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: user_uuid || null, // leave null if guest, otherwise pass uuid
          tour_id,
          booking_date,
          full_name,
          email,   // email is stored as text
          phone,
          persons,
          status,
          payment_method: payment_method || null,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) {
      console.error("Supabase select error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
 
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select();
 
    if (error) {
      console.error("Supabase update error:", error);
      return res.status(500).json({ error: error.message });
    }
 
    res.json(data[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;