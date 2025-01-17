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
      },
      id: '2',
        title: 'Test Vinyls',
        artist: 'Test Artists',
        price: 2.99,
        quantity: 1,
        condition: 'Good',
        year: 2024
    }).as('getProduct');
    cy.intercept('GET', 'http://localhost:8080/coupons/validate/*', {
      statusCode: 404
    }).as('couponValidation');

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
  it('should remove item from basket', () => {
    // Add item to basket
    cy.get('button').contains('Add to Cart').click();
  
    // Navigate to basket page
    cy.visit('/basket');
  
    // Verify item in basket
    cy.contains('div', 'Test Vinyl').should('be.visible');
  
    // Remove the item by finding the last column's button (which contains the X icon)
    cy.get('div.col-span-1 > button').first().click();
  
    // Verify basket is empty
    cy.contains('div', 'Your basket is empty').should('be.visible');
  
    // Check localStorage is an empty basket
    cy.getLocalStorage('guestBasket').then((basket) => {
      const parsedBasket = JSON.parse(basket);
      expect(parsedBasket.items).to.have.length(0);
      expect(parsedBasket.totalAmount).to.equal(0);
    });
  });
  it('should continue shopping from empty basket', () => {
    // Navigate to basket page
    cy.visit('/basket');

    // Verify empty basket state
    cy.contains('div', 'Your basket is empty').should('be.visible');

    // Click "Start Shopping" button
    cy.contains('a', 'Start Shopping').click();

    // Verify redirected to products page
    cy.url().should('include', '/products');
  });
});