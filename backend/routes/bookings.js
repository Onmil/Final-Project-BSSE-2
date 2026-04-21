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
      amount
    } = req.body;

    try {
      
      // STEP 1: VALIDATION FIRST
      if (
        !tour_id ||
        !booking_date ||
        !full_name ||
        !email ||
        !phone ||
        !persons ||
        !payment_method ||
        !amount
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email" });
      }

      // Phone validation (PH format)
      const phoneRegex = /^(09\d{9}|\+639\d{9})$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: "Invalid phone" });
      }

      // Persons validation
      if (typeof persons !== "number" || persons <= 0) {
        return res.status(400).json({ error: "Invalid number of persons" });
      }

      // Amount validation
      if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      // STEP 2: INSERT BOOKING
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
            status: status || "pending",
            payment_method,
          },
        ])
        .select()
        .single();

      if (bookingError) {
        console.error("Booking insert error:", bookingError);
        return res.status(500).json({ error: bookingError.message });
      }


      // STEP 3: INSERT PAYMENT
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            booking_id: bookingData.id,
            amount,
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

      // STEP 4: RESPONSE
      return res.status(200).json({
        success: true,
        booking: bookingData,
      });

    } catch (err) {
      console.error("Server error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  module.exports = router;