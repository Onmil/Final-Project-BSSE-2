describe('Booking Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');

    cy.get('.auth-btn.login').click();

    cy.get('input[name="email"]').type('onil.martinez-23@cpu.edu.ph');
    cy.get('input[name="password"]').type('23-0407-44Onil');

    cy.get('.modal-submit').click();

    cy.get('.modal-overlay', { timeout: 10000 }).should('not.exist');

    cy.get('.nav-link').contains('TOURS').click();

    cy.get('.tour-card', { timeout: 10000 }).should('exist');
  });

  it('should open booking form when Book Now is clicked', () => {
    cy.get('.tour-btn').first().click();
    cy.get('.bf-box').should('exist');
  });

  it('should fill booking form and proceed to payment step', () => {
    cy.get('.tour-btn').first().click();

    cy.get('#fullName').type('Test User');
    cy.get('#email').type('test@gmail.com');
    cy.get('#phone').type('+639123456789');
    cy.get('#date').select(1);

    cy.get('.bf-submit').contains('Proceed to Payment').click();

    cy.get('.bf-payment-box').should('exist');
  });

  it('should allow selecting a payment method', () => {
    cy.get('.tour-btn').first().click();

    cy.get('#fullName').type('Test User');
    cy.get('#email').type('test@gmail.com');
    cy.get('#phone').type('+639123456789');
    cy.get('#date').select(1);

    cy.get('.bf-submit').contains('Proceed to Payment').click();

    cy.get('.bf-payment-option').first().click();

    cy.get('.bf-submit').should('not.be.disabled');
  });

  it('should complete booking flow successfully', () => {
    cy.get('.tour-btn').first().click();

    cy.get('#fullName').type('Test User');
    cy.get('#email').type('test@gmail.com');
    cy.get('#phone').type('+639123456789');
    cy.get('#date').select(1);

    cy.get('.bf-submit').contains('Proceed to Payment').click();

    cy.get('.bf-payment-option').first().click();
    cy.get('.bf-submit').click();

    cy.get('.bf-success', { timeout: 15000 }).should('exist');
  });
});