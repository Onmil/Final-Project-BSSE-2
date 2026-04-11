const request = require('supertest');
const app = require('../app');

jest.mock('../services/supabaseClient');
jest.mock('bcrypt');

const supabase = require('../services/supabaseClient');
const bcrypt = require('bcrypt');

describe('POST /users/signup', () => {

  beforeEach(() => jest.clearAllMocks());

  // happy path: successful signup
  it('should register a new user successfully', async () => {
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [{ id: 'mock-uuid-123', name: 'Peter Parker', email: 'peter@gmail.com' }],
          error: null,
        }),
      }),
    }));

    bcrypt.hash.mockResolvedValue('hashed_password');

    const res = await request(app).post('/users/signup').send({
      name: 'Peter Parker',
      email: 'peter@gmail.com',
      password: 'Password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'Peter Parker');
    expect(res.body).toHaveProperty('email', 'peter@gmail.com');
  });

  // happy path: email stored in lowercase regardless of input case
  it('should normalize email to lowercase on signup', async () => {
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [{ id: 'mock-uuid-456', name: 'Mary Jane', email: 'maryjane@gmail.com' }],
          error: null,
        }),
      }),
    }));

    bcrypt.hash.mockResolvedValue('hashed_password');

    const res = await request(app).post('/users/signup').send({
      name: 'Mary Jane',
      email: 'MARYJANE@GMAIL.COM',
      password: 'Password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'maryjane@gmail.com');
  });

  // happy path: response does not expose password hash
  it('should not return password_hash in response', async () => {
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [{ id: 'mock-uuid-789', name: 'Tony Stark', email: 'tony@stark.com', password_hash: 'hashed_password' }],
          error: null,
        }),
      }),
    }));

    bcrypt.hash.mockResolvedValue('hashed_password');

    const res = await request(app).post('/users/signup').send({
      name: 'Tony Stark',
      email: 'tony@stark.com',
      password: 'IronMan123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).not.toHaveProperty('password_hash');
  });

  // sad path: missing fields
  it('should return 400 if fields are missing', async () => {
    const res = await request(app).post('/users/signup').send({
      email: 'peter@gmail.com',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Name, email, and password are required.');
  });

  // sad path: email already registered
  it('should return 409 if email is already registered', async () => {
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [{ id: 'existing-uuid', name: 'Peter Parker', email: 'peter@gmail.com' }],
        error: null,
      }),
    }));

    const res = await request(app).post('/users/signup').send({
      name: 'Peter Parker',
      email: 'peter@gmail.com',
      password: 'Password123',
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error', 'Email already registered.');
  });

});

describe('POST /users/login', () => {

  beforeEach(() => jest.clearAllMocks());

  // happy path: successful login
  it('should login successfully with correct credentials', async () => {
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [{ id: 'mock-uuid-123', name: 'Peter Parker', email: 'peter@gmail.com', password_hash: 'hashed_password' }],
        error: null,
      }),
    }));

    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app).post('/users/login').send({
      email: 'peter@gmail.com',
      password: 'Password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'Peter Parker');
    expect(res.body).toHaveProperty('email', 'peter@gmail.com');
  });

  // happy path: email stored in lowercase regardless of input case
  it('should login successfully with uppercase email', async () => {
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [{ id: 'mock-uuid-123', name: 'Peter Parker', email: 'peter@gmail.com', password_hash: 'hashed_password' }],
        error: null,
      }),
    }));

    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app).post('/users/login').send({
      email: 'PETER@GMAIL.COM',
      password: 'Password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'peter@gmail.com');
  });

  // happy path: response does not expose password hash
  it('should not return password_hash in login response', async () => {
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [{ id: 'mock-uuid-123', name: 'Peter Parker', email: 'peter@gmail.com', password_hash: 'hashed_password' }],
        error: null,
      }),
    }));

    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app).post('/users/login').send({
      email: 'peter@gmail.com',
      password: 'Password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).not.toHaveProperty('password_hash');
  });

  // sad path: missing fields
  it('should return 400 if email or password is missing', async () => {
    const res = await request(app).post('/users/login').send({
      email: 'peter@gmail.com',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Email and password required.');
  });

  // sad path: incorrect password
  it('should return 401 if password is incorrect', async () => {
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [{ id: 'mock-uuid-123', name: 'Peter Parker', email: 'peter@gmail.com', password_hash: 'hashed_password' }],
        error: null,
      }),
    }));

    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post('/users/login').send({
      email: 'peter@gmail.com',
      password: 'WrongPassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid email or password.');
  });

  // sad path: user does not exist
  it('should return 401 if user does not exist', async () => {
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: [], error: null }),
    }));

    const res = await request(app).post('/users/login').send({
      email: 'nobody@gmail.com',
      password: 'Password123',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid email or password.');
  });

});