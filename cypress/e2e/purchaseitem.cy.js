// cypress/e2e/purchaseitem.cy.js
describe('Record Purchase Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
  
      // Mock initial data loads for products page
      cy.intercept('GET', 'http://localhost:8080/records', {
        statusCode: 200,
        body: [{
          id: 1,
          title: 'Test Album',
          artist: 'Test Artist',
          price: 29.99,
          quantity: 5,
          condition: 'New',
          year: '2024'
        }]
      }).as('getProducts');
  
      // Mock individual product data
      cy.intercept('GET', 'http://localhost:8080/records/1', {
        statusCode: 200,
        body: {
          id: 1,
          title: 'Test Album',
          artist: 'Test Artist',
          price: 29.99,
          quantity: 5,
          condition: 'New',
          year: '2024',
          images: [{ id: 1, imageType: 'MAIN' }]
        }
      }).as('getProduct');
  
      // Mock image data
      cy.intercept('GET', 'http://localhost:8080/records/images/*', {
        statusCode: 200,
        body: 'mock-image-data'
      });
  
      // Mock checkout session creation
      cy.intercept('POST', 'http://localhost:8080/api/payment/create-checkout-session', {
        statusCode: 200,
        body: {
          clientSecret: 'test_secret'
        }
      }).as('createCheckoutSession');
  
      // Mock session verification
      cy.intercept('POST', 'http://localhost:8080/api/payment/verify-session/*', {
        statusCode: 200
      }).as('verifySession');
  
      // Start from the overall products page
      cy.visit('http://localhost:3000/products');
    });
  
    it('should validate guest form fields', () => {
      // Wait for products to load
      cy.wait('@getProducts');
  
      // Click on the first product
      cy.get('a[href^="/product/"]').first().click();
  
      // Wait for product details to load
      cy.wait('@getProduct');
      
      // Open checkout modal
      cy.contains('button', 'Checkout').click();
  
      // Try to submit empty form
      cy.contains('button', 'Continue to Payment').click();
  
      // Trigger validation by focusing and bluring each required field
      cy.get('input[name="fname"]').focus().blur();
      cy.get('input[name="lname"]').focus().blur();
      cy.get('input[name="email"]').focus().blur();
      cy.get('input[name="address"]').focus().blur();
      cy.get('input[name="postalCode"]').focus().blur();
      cy.get('input[name="country"]').focus().blur();
      cy.get('input[name="city"]').focus().blur();
      cy.get('input[name="phonenum"]').focus().blur();
  
      // Verify validation messages
      cy.get('.text-red-600').should('exist')
        .and('contain', 'Must be between 2 and 50 characters');
    });
  
    it('should complete purchase with successful payment', () => {
      // Wait for products to load
      cy.wait('@getProducts');
  
      // Click on the first product
      cy.get('a[href^="/product/"]').first().click();
  
      // Wait for product details to load
      cy.wait('@getProduct');
  
      // Click Checkout button
      cy.contains('button', 'Checkout').click();
  
      // Fill out guest details form
      cy.get('input[name="fname"]').type('John');
      cy.get('input[name="lname"]').type('Doe');
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('input[name="address"]').type('123 Main St');
      cy.get('input[name="postalCode"]').type('12345');
      cy.get('input[name="country"]').type('USA');
      cy.get('input[name="city"]').type('New York');
      cy.get('input[name="region"]').type('NY');
      cy.get('input[name="phonenum"]').type('1234567890');
  
      // Submit guest form
      cy.contains('button', 'Continue to Payment').click();
  
      // Wait for checkout session to be created
      cy.wait('@createCheckoutSession');
  
      // Directly navigate to success page since we can't interact with Stripe iframe
      cy.visit('/success?session_id=test_session');
      
      // Verify we're on success page
      cy.url().should('include', '/success');
      cy.contains('Order Confirmed!').should('be.visible');
    });
  });