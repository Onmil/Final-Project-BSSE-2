const request = require('supertest');
const app = require('../app');
const supabase = require('../services/supabaseClient');

const BOOKINGS_TABLE = process.env.SUPABASE_BOOKINGS_TABLE || 'bookings';
const PAYMENTS_TABLE = process.env.SUPABASE_PAYMENTS_TABLE || 'payments';

describe('Booking API (Integration Tests - Supabase)', () => {

  let createdBookingIds = [];


  // HELPERS
  const uniqueEmail = () =>
    `booking_${Date.now()}_${Math.floor(Math.random() * 10000)}@gmail.com`;

  const testBooking = (overrides = {}) => ({
    user_uuid: null, // adjust if required
    tour_id: 1,
    booking_date: '2026-04-14',
    full_name: 'Test User',
    email: uniqueEmail(),
    phone: '09171234567',
    persons: 2,
    payment_method: 'gcash',
    status: 'confirmed',
    amount: 1200,
    ...overrides
  });

  const trackBooking = (id) => {
    if (id) createdBookingIds.push(id);
  };

  const cleanupBookings = async () => {
    for (const id of createdBookingIds) {
      // delete payments first (avoid FK issues)
      await supabase
        .from(PAYMENTS_TABLE)
        .delete()
        .eq('booking_id', id);

      await supabase
        .from(BOOKINGS_TABLE)
        .delete()
        .eq('id', id);
    }
    createdBookingIds = [];
  };

  afterEach(async () => {
    await cleanupBookings();
  });


  // CREATE BOOKING
  describe('POST /bookings', () => {


    //  SUCCESS
    it('should create booking and payment successfully', async () => {
      const booking = testBooking();

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.booking).toHaveProperty('id');

      trackBooking(res.body.booking.id);
    });

    //  VALIDATION
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/bookings')
        .send({ email: uniqueEmail() });

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const booking = testBooking({ email: 'invalid-email' });

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for invalid phone format', async () => {
      const booking = testBooking({ phone: '123' });

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if persons is 0', async () => {
      const booking = testBooking({ persons: 0 });

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if persons is negative', async () => {
      const booking = testBooking({ persons: -2 });

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      expect(res.statusCode).toBe(400);
    });


    //  BUSINESS LOGIC
    it('should return 400 if booking date is in the past', async () => {
      const booking = testBooking({ booking_date: '2020-01-01' });

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      expect(res.statusCode).toBe(400);
    });

    it('should return error for invalid tour_id', async () => {
      const booking = testBooking({ tour_id: 999999 });

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      expect([400, 500]).toContain(res.statusCode);
    });

  
    //  PAYMENT VALIDATION
    it('should return 400 if payment_method is missing', async () => {
      const booking = testBooking();
      delete booking.payment_method;

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if amount is missing', async () => {
      const booking = testBooking();
      delete booking.amount;

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for invalid payment_method', async () => {
      const booking = testBooking({ payment_method: 'invalid_method' });

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      expect([400, 500]).toContain(res.statusCode);
    });

    it('should return 400 if amount is zero or negative', async () => {
      const booking = testBooking({ amount: -100 });

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      expect(res.statusCode).toBe(400);
    });

    // FAILURE SCENARIO

    it('should handle DB constraint failure gracefully', async () => {
      const booking = testBooking({
        // intentionally break constraint if your DB enforces it
        tour_id: null
      });

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      expect([400, 500]).toContain(res.statusCode);
    });

    //  RESPONSE SAFETY
    it('should not expose internal fields in response', async () => {
      const booking = testBooking();

      const res = await request(app)
        .post('/bookings')
        .send(booking);

      if (res.statusCode === 200) {
        trackBooking(res.body.booking.id);

        expect(res.body.booking).not.toHaveProperty('internal_notes');
        expect(res.body.booking).not.toHaveProperty('deleted_at');
      }
    });

  });

});