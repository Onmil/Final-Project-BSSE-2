describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should load the landing page with hero section', () => {
    cy.get('.hero').should('exist');
  });

  it('should show the navbar', () => {
    cy.get('.navbar').should('exist');
  });

  it('should show login and signup buttons when not logged in', () => {
    cy.get('.auth-btn.login').should('exist');
    cy.get('.auth-btn.signup').should('exist');
  });

  it('should show active card title and description', () => {
    cy.get('.title').should('exist');
    cy.get('.description').should('exist');
  });

  it('should show 3 swap cards', () => {
    cy.get('.swap-card').should('have.length', 3);
  });

  it('should have one active swap card by default', () => {
    cy.get('.swap-card.active').should('have.length', 1);
  });

  it('should change active card when non-active swap card is clicked', () => {
    cy.get('.swap-card').not('.active').first().click();
    cy.get('.swap-card.active').should('have.length', 1);
  });

  it('should show search input and button', () => {
    cy.get('.top-search input').should('exist');
    cy.get('.top-search button').should('contain', 'Search');
  });

  it('should show suggestions when typing a destination', () => {
    cy.get('.top-search input').type('Ilo');
    cy.get('.search-suggestions').should('exist');
    cy.get('.search-suggestions li').should('have.length.greaterThan', 0);
  });

  it('should select a suggestion and update the active card title', () => {
    cy.get('.top-search input').type('Boracay');
    cy.get('.search-suggestions li').first().click();
    cy.get('.title').should('contain', 'Boracay');
  });

  it('should hide suggestions when clicking outside', () => {
    cy.get('.top-search input').type('Ilo');
    cy.get('.search-suggestions').should('exist');
    cy.get('.overlay').click({ force: true });
    cy.get('.search-suggestions').should('not.exist');
  });

  it('should show Explore button', () => {
    cy.get('.explore-btn').should('exist');
  });

  it('should open signup modal when Explore is clicked and not logged in', () => {
    cy.get('.explore-btn').click();
    cy.get('.modal-overlay').should('exist');
    cy.get('.modal-title').should('contain', 'Create Account');
  });
});