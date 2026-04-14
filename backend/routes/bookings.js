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
    user_uuid,
    amount // IMPORTANT: we will use this for payments
  } = req.body;

  try {
    // STEP 1: Insert booking
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: user_uuid || null,
          tour_id,
          booking_date,
          full_name,
          email,
          phone,
          persons,
          status,
          payment_method: payment_method || null,
        },
      ])
      .select()
      .single();

    if (bookingError) {
      console.error("Booking insert error:", bookingError);
      return res.status(500).json({ error: bookingError.message });
    }

    // STEP 2: Insert payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          booking_id: bookingData.id,
          amount: amount || 0,
          method: payment_method,
          paid_at:
            payment_method === "pay_on_arrival"
              ? null
              : new Date().toISOString(),
        },
      ]);

    if (paymentError) {
      console.error("Payment insert error:", paymentError);
      return res.status(500).json({ error: paymentError.message });
    }

    // STEP 3: Return response
    res.json({
      success: true,
      booking: bookingData,
    });

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