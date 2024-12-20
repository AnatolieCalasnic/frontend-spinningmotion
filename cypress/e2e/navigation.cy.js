describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to home page', () => {
    cy.get('a').contains('SPINNING MOTION').should('be.visible');
    cy.url().should('include', '/');
  });


  it('should navigate through genres', () => {
    // Mock genres API
    cy.intercept('GET', 'http://localhost:8080/genres', {
      statusCode: 200,
      body: {
        genres: ['Rock', 'Jazz', 'Electronic']
      }
    }).as('getGenres');

    // Reload to trigger genre fetch
    cy.reload();
    cy.wait('@getGenres');

    // Click on a genre
    cy.get('a').contains('Rock').click();

    // Verify genre page
    cy.url().should('include', '/genre/rock');
  });
});