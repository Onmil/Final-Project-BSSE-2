const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');

const allowedPaymentMethods = ["gcash", "card", "pay_on_arrival"];

// Optional: define allowed tour IDs since you removed tours table
const VALID_TOUR_IDS = new Set([1,2,3,4,5,6,101,102,103,104,105,106]);

router.post('/', async (req, res) => {
  try {
    let {
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

    // -----------------------
    // NORMALIZATION (CRITICAL FIX)
    // -----------------------
    const parsedTourId = Number(tour_id);
    const parsedPersons = Number(persons);
    const parsedAmount = Number(amount);

    // -----------------------
    // REQUIRED FIELDS CHECK (STRICT + SAFE)
    // -----------------------
    if (
      tour_id === undefined ||
      booking_date === undefined ||
      full_name === undefined ||
      email === undefined ||
      phone === undefined ||
      persons === undefined ||
      payment_method === undefined ||
      amount === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // -----------------------
    // TOUR ID VALIDATION (FIXED)
    // -----------------------
    if (!Number.isInteger(parsedTourId) || parsedTourId <= 0) {
      return res.status(400).json({ error: "Invalid tour_id" });
    }

    // If you want strict enforcement (recommended since no tours table):
    if (!VALID_TOUR_IDS.has(parsedTourId)) {
      return res.status(400).json({ error: "Invalid tour_id" });
    }

    // -----------------------
    // EMAIL VALIDATION
    // -----------------------
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // -----------------------
    // PHONE VALIDATION
    // -----------------------
    const phoneRegex = /^(09\d{9}|\+639\d{9})$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone" });
    }

    // -----------------------
    // PERSONS VALIDATION
    // -----------------------
    if (!Number.isInteger(parsedPersons) || parsedPersons <= 0) {
      return res.status(400).json({ error: "Invalid number of persons" });
    }

    // -----------------------
    // AMOUNT VALIDATION
    // -----------------------
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // -----------------------
    // DATE VALIDATION
    // -----------------------
    const bookingDateObj = new Date(booking_date);

    if (isNaN(bookingDateObj.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const now = new Date();
    if (bookingDateObj < now) {
      return res.status(400).json({ error: "Booking date cannot be in the past" });
    }

    // -----------------------
    // PAYMENT METHOD VALIDATION
    // -----------------------
    if (!allowedPaymentMethods.includes(payment_method)) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // -----------------------
    // INSERT BOOKING
    // -----------------------
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id: user_uuid || null,
        tour_id: parsedTourId,
        booking_date,
        full_name,
        email,
        phone,
        persons: parsedPersons,
        status: status || "pending",
        payment_method
      }])
      .select()
      .single();

    if (bookingError) {
      console.error("Booking insert error:", bookingError);
      return res.status(500).json({ error: bookingError.message });
    }

    // -----------------------
    // INSERT PAYMENT
    // -----------------------
    const { error: paymentError } = await supabase
      .from('payments')
      .insert([{
        booking_id: bookingData.id,
        amount: parsedAmount,
        method: payment_method,
        paid_at:
          payment_method === "pay_on_arrival"
            ? null
            : new Date().toISOString()
      }]);

    if (paymentError) {
      console.error("Payment insert error:", paymentError);
      return res.status(500).json({ error: paymentError.message });
    }

    // -----------------------
    // RESPONSE
    // -----------------------
    return res.status(200).json({
      success: true,
      booking: bookingData
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;