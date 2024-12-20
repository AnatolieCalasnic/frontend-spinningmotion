describe('Basket Functionality', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean state
    cy.clearLocalStorage('guestBasket');
    
    // Mock the API response for a product
    cy.intercept('GET', 'http://localhost:8080/records/*', {
      statusCode: 200,
      body: {
        id: '1',
        title: 'Test Vinyl',
        artist: 'Test Artist',
        price: 24.99,
        quantity: 10,
        condition: 'Mint',
        year: 2023
      }
    }).as('getProduct');

    // Visit the product page
    cy.visit('/product/1');
    cy.wait('@getProduct');
  });

  it('should add item to basket', () => {
    // Add item to basket
    cy.get('button').contains('Add to Cart').click();

    // Check localStorage
    cy.getLocalStorage('guestBasket').then((basket) => {
      const parsedBasket = JSON.parse(basket);
      expect(parsedBasket.items).to.have.length(1);
      expect(parsedBasket.items[0].title).to.equal('Test Vinyl');
    });

    // Navigate to basket page
    cy.visit('/basket');

    // Verify item in basket
    cy.get('div').contains('Test Vinyl').should('be.visible');
    cy.get('div').contains('€24.99').should('be.visible');
  });

});