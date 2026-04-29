describe('Auth - Navbar Buttons', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should open login modal when Login is clicked', () => {
    cy.get('.auth-btn.login').click();
    cy.get('.modal-overlay').should('exist');
    cy.get('.modal-title').should('contain', 'Welcome Back');
  });

  it('should open signup modal when Sign Up is clicked', () => {
    cy.get('.auth-btn.signup').click();
    cy.get('.modal-overlay').should('exist');
    cy.get('.modal-title').should('contain', 'Create Account');
  });

  it('should close modal when X is clicked', () => {
    cy.get('.auth-btn.login').click();
    cy.get('.modal-close').click();
    cy.get('.modal-overlay').should('not.exist');
  });

  it('should close modal when clicking outside', () => {
    cy.get('.auth-btn.login').click();
    cy.get('.modal-overlay').click({ force: true });
    cy.get('.modal-overlay').should('not.exist');
  });

  it('should switch from login to signup modal', () => {
    cy.get('.auth-btn.login').click();
    cy.get('.modal-switch span').click();
    cy.get('.modal-title').should('contain', 'Create Account');
  });

  it('should switch from signup to login modal', () => {
    cy.get('.auth-btn.signup').click();
    cy.get('.modal-switch span').click();
    cy.get('.modal-title').should('contain', 'Welcome Back');
  });
});

describe('Auth - Login Validation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.get('.auth-btn.login').click();
  });

  it('should show error when submitting empty form', () => {
    cy.get('.modal-submit').click();
    cy.get('.field-error').should('exist');
  });

  it('should show error for invalid email', () => {
    cy.get('input[name="email"]').invoke('attr', 'type', 'text').type('notanemail@');
    cy.get('input[name="password"]').type('Password123');
    cy.get('.modal-submit').click();
    cy.wait(1000);
    cy.get('.modal-form').then(($form) => {
    cy.log($form.html());
  });
    cy.get('.field-error').should('exist');
  });

  it('should show error for short password', () => {
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('123');
    cy.get('.modal-submit').click();
    cy.get('.field-error').should('contain', '8 characters');
  });

  it('should toggle password visibility', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    cy.get('.password-toggle').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    cy.get('.password-toggle').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('should show error for wrong credentials', () => {
    cy.get('input[name="email"]').type('wrong@gmail.com');
    cy.get('input[name="password"]').type('Password123');
    cy.get('.modal-submit').click();
    cy.get('.field-error', { timeout: 6000 }).should('exist');
  });
});

describe('Auth - Signup Validation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.get('.auth-btn.signup').click();
  });

  it('should show error when name is missing', () => {
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('Password123');
    cy.get('.modal-submit').click();
    cy.get('.field-error').should('contain', 'Full name is required');
  });

  it('should show password strength indicator', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('Password123');
    cy.get('.strength-bar-wrap').should('exist');
    cy.get('.strength-label').should('exist');
  });

  it('should show error for weak password', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('password');
    cy.get('.modal-submit').click();
    cy.get('.field-error').should('exist');
  });
});