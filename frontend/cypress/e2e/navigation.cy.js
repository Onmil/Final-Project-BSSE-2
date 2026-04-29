describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should show HOME as active by default', () => {
    cy.get('.nav-link.active').should('contain', 'HOME');
  });

  it('should navigate to Tours when TOURS is clicked and logged in', () => {
  cy.get('.auth-btn.login').click();
  cy.get('input[name="email"]').type('annpineda3@gmail.com');
  cy.get('input[name="password"]').type('Annpineda3');
  cy.get('.modal-submit').click();
  cy.get('.modal-overlay', { timeout: 10000 }).should('not.exist');
  cy.get('.nav-link').contains('TOURS').click();
  cy.get('.nav-link.active').should('contain', 'TOURS');
});

  it('should open signup modal when TOURS is clicked and not logged in', () => {
    cy.get('.nav-link').contains('TOURS').click();
    cy.get('.modal-overlay').should('exist');
    cy.get('.modal-title').should('contain', 'Create Account');
  });

  it('should open signup modal when DESTINATIONS is clicked and not logged in', () => {
    cy.get('.nav-link').contains('DESTINATIONS').click();
    cy.get('.modal-overlay').should('exist');
    cy.get('.modal-title').should('contain', 'Create Account');
  });

  it('should navigate to home when logo is clicked', () => {
  cy.get('.nav-link').contains('TOURS').click();
  cy.get('.modal-close').click();
  cy.get('.logo').click();
  cy.get('.hero').should('exist');
});
});