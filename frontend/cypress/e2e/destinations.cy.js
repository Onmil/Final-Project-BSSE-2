describe('Destinations Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');

    cy.get('.auth-btn.login').click();
    cy.get('input[name="email"]').type('onil.martinez-23@cpu.edu.ph');
    cy.get('input[name="password"]').type('23-0407-44Onil');
    cy.get('.modal-submit').click();

    cy.get('.nav-link').contains('DESTINATIONS').click();
  });

  it('should show loading or empty state initially', () => {
    cy.get('.dest-page').should('exist');

    cy.get('body').then(($body) => {
      const hasState = $body.find('.dest-state').length > 0;
      const hasGrid = $body.find('.dest-grid').length > 0;

      expect(hasState || hasGrid).to.eq(true);
    });
  });

  it('should show either empty state or bookings grid', () => {
    cy.get('.dest-page').should('exist');

    cy.get('.dest-state, .dest-grid', { timeout: 10000 })
      .should('exist');
  });

  it('should display correct state after data loads', () => {
    cy.get('.dest-page').should('exist');

    cy.get('.dest-state, .dest-grid', { timeout: 10000 }).then(($el) => {
      const isEmpty = $el.hasClass('dest-state');
      const isGrid = $el.hasClass('dest-grid');

      expect(isEmpty || isGrid).to.eq(true);
    });
  });
});