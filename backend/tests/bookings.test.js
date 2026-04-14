const request = require('supertest');
const app = require('../app');

jest.mock('../services/supabaseClient');

const supabase = require('../services/supabaseClient');

describe('POST /bookings', () => {

  beforeEach(() => jest.clearAllMocks());

  
  // HAPPY PATH
  
  it('should create booking and payment successfully', async () => {

    supabase.from.mockImplementation((table) => {

      // MOCK BOOKINGS TABLE
      if (table === 'bookings') {
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: {
              id: 101,
              user_id: 'user-1',
              tour_id: 1,
              booking_date: '2026-04-14',
              full_name: 'Test User',
              email: 'test@test.com',
              phone: '09171234567',
              persons: 2,
              status: 'confirmed',
              payment_method: 'gcash'
            },
            error: null,
          }),
        };
      }

      // MOCK PAYMENTS TABLE
      if (table === 'payments') {
        return {
          insert: jest.fn().mockResolvedValue({
            error: null,
          }),
        };
      }

    });

    const res = await request(app).post('/bookings').send({
      user_uuid: 'user-1',
      tour_id: 1,
      booking_date: '2026-04-14',
      full_name: 'Test User',
      email: 'test@test.com',
      phone: '09171234567',
      persons: 2,
      payment_method: 'gcash',
      status: 'confirmed',
      amount: 1200
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.booking).toHaveProperty('id', 101);
  });


  
  // SAD PATH: booking fails
 
  it('should return 500 if booking insert fails', async () => {

    supabase.from.mockImplementation((table) => {

      if (table === 'bookings') {
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Booking insert failed' },
          }),
        };
      }

    });

    const res = await request(app).post('/bookings').send({
      tour_id: 1,
      booking_date: '2026-04-14',
      full_name: 'Test User',
      email: 'test@test.com',
      phone: '09171234567',
      persons: 2,
      payment_method: 'gcash',
      amount: 1200
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });


  
  // SAD PATH: payment fails
 
  it('should return 500 if payment insert fails', async () => {

    supabase.from.mockImplementation((table) => {

      if (table === 'bookings') {
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { id: 999 },
            error: null,
          }),
        };
      }

      if (table === 'payments') {
        return {
          insert: jest.fn().mockResolvedValue({
            error: { message: 'Payment insert failed' },
          }),
        };
      }

    });

    const res = await request(app).post('/bookings').send({
      tour_id: 1,
      booking_date: '2026-04-14',
      full_name: 'Test User',
      email: 'test@test.com',
      phone: '09171234567',
      persons: 2,
      payment_method: 'gcash',
      amount: 1200
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

});

