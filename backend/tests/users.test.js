const request = require('supertest');
const app = require('../app');
const supabase = require('../services/supabaseClient');

const USERS_TABLE = process.env.SUPABASE_USERS_TABLE || 'users';

describe('Users API (Integration Tests - Supabase)', () => {

  let createdEmails = [];

  const testUser = (name, email, password) => ({
    name,
    email,
    password
  });

  // unique email
  const uniqueEmail = () =>
    `test_${Date.now()}_${Math.floor(Math.random() * 10000)}@gmail.com`;

  const trackUser = (email) => {
    createdEmails.push(email.toLowerCase());
  };

  const cleanupUsers = async () => {
    for (const email of createdEmails) {
      await supabase
        .from(USERS_TABLE)
        .delete()
        .eq('email', email);
    }
    createdEmails = [];
  };

  afterEach(async () => {
    await cleanupUsers();
  });

  // signup tests
  describe('POST /users/signup', () => {

    it('should register a new user successfully', async () => {
      const email = uniqueEmail();
      const user = testUser('Test User', email, 'Password123');

      const res = await request(app)
        .post('/users/signup')
        .send(user);

      trackUser(email);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe(email.toLowerCase());
    });

    it('should normalize email to lowercase', async () => {
      const email = uniqueEmail().toUpperCase();
      const user = testUser('Test User', email, 'Password123');

      const res = await request(app)
        .post('/users/signup')
        .send(user);

      trackUser(email);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(email.toLowerCase());
    });

    it('should not return password_hash', async () => {
      const email = uniqueEmail();
      const user = testUser('Secure User', email, 'Password123');

      const res = await request(app)
        .post('/users/signup')
        .send(user);

      trackUser(email);

      expect(res.statusCode).toBe(200);
      expect(res.body).not.toHaveProperty('password_hash');
    });

    it('should return 400 if fields are missing', async () => {
      const res = await request(app)
        .post('/users/signup')
        .send({ email: uniqueEmail() });

      expect(res.statusCode).toBe(400);
    });

    it('should return 409 if email already exists', async () => {
      const email = uniqueEmail();
      const user = testUser('Duplicate User', email, 'Password123');

      await request(app).post('/users/signup').send(user);
      trackUser(email);

      const res = await request(app)
        .post('/users/signup')
        .send(user);

      expect(res.statusCode).toBe(409);
    });

  });

  //login tests
  describe('POST /users/login', () => {

    it('should login successfully with correct credentials', async () => {
      const email = uniqueEmail();
      const user = testUser('Login User', email, 'Password123');

      await request(app).post('/users/signup').send(user);
      trackUser(email);

      const res = await request(app)
        .post('/users/login')
        .send({
          email,
          password: user.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(email.toLowerCase());
    });

    it('should login with uppercase email', async () => {
      const email = uniqueEmail();
      const user = testUser('Upper User', email, 'Password123');

      await request(app).post('/users/signup').send(user);
      trackUser(email);

      const res = await request(app)
        .post('/users/login')
        .send({
          email: email.toUpperCase(),
          password: user.password
        });

      expect(res.statusCode).toBe(200);
    });

    it('should not return password_hash on login', async () => {
      const email = uniqueEmail();
      const user = testUser('Safe Login', email, 'Password123');

      await request(app).post('/users/signup').send(user);
      trackUser(email);

      const res = await request(app)
        .post('/users/login')
        .send({
          email,
          password: user.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).not.toHaveProperty('password_hash');
    });

    it('should return 400 if missing fields', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({ email: uniqueEmail() });

      expect(res.statusCode).toBe(400);
    });

    it('should return 401 if password is incorrect', async () => {
      const email = uniqueEmail();
      const user = testUser('Wrong Pass', email, 'Password123');

      await request(app).post('/users/signup').send(user);
      trackUser(email);

      const res = await request(app)
        .post('/users/login')
        .send({
          email,
          password: 'WrongPassword'
        });

      expect(res.statusCode).toBe(401);
    });

    it('should return 401 if user does not exist', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: uniqueEmail(),
          password: 'Password123'
        });

      expect(res.statusCode).toBe(401);
    });

  });

});