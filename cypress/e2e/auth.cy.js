
describe('Authentication', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit('http://localhost:3000');

    // Mock the initial endpoints that load when the page renders
    cy.intercept('GET', 'http://localhost:8080/featured-albums', {
      statusCode: 200,
      body: []
    });
    
    cy.intercept('GET', 'http://localhost:8080/genres', {
      statusCode: 200,
      body: { genres: [] }
    });
  });

  const openAuthModalDesktop = () => {
    // More specific selector matching your actual button classes
    cy.get('button.text-white.hover\\:text-blue-600.hidden.md\\:block').should('exist').click();
  };

  const fillLoginForm = (email, password) => {
    cy.get('input[name="email"]').should('be.visible').type(email);
    cy.get('input[name="password"]').should('be.visible').type(password);
  };

  const fillRegistrationForm = (userData) => {
    cy.get('input[name="email"]').should('be.visible').type(userData.email);
    cy.get('input[name="password"]').should('be.visible').type(userData.password);
    cy.get('input[name="fname"]').should('be.visible').type(userData.fname);
    cy.get('input[name="lname"]').should('be.visible').type(userData.lname);
    cy.get('input[name="address"]').should('be.visible').type(userData.address);
    cy.get('input[name="postalCode"]').should('be.visible').type(userData.postalCode);
    cy.get('input[name="country"]').should('be.visible').type(userData.country);
    cy.get('input[name="city"]').should('be.visible').type(userData.city);
    cy.get('input[name="phonenum"]').should('be.visible').type(userData.phonenum);
  };

  describe('Modal Behavior', () => {
    it('should open auth modal when clicking user icon', () => {
      // More specific selector and checking visibility
      cy.get('button.text-white.hover\\:text-blue-600.hidden.md\\:block')
        .should('be.visible')
        .click();
        
      cy.get('.fixed.inset-0').should('be.visible');
      cy.get('.bg-white').should('be.visible');
      cy.contains('Login').should('be.visible');
    });

    it('should close modal when clicking close button', () => {
      openAuthModalDesktop();
      cy.get('.fixed.inset-0').should('be.visible');
      cy.get('button').contains('×').click();
      cy.get('.fixed.inset-0').should('not.exist');
    });
  });

  describe('Login Flow', () => {
    it('should show validation errors for invalid login inputs', () => {
      openAuthModalDesktop();
      cy.get('form').should('be.visible');
      cy.get('button[type="submit"]').click();
      
      cy.contains('Please enter a valid email address').should('be.visible');
      cy.contains('Password must be at least 6 characters long').should('be.visible');
    });

    it('should successfully login with valid credentials', () => {
      cy.intercept('POST', 'http://localhost:8080/tokens', {
        statusCode: 200,
        body: {
          userId: 1,
          email: 'test@example.com',
          isAdmin: false
        }
      }).as('loginRequest');

      openAuthModalDesktop();
      fillLoginForm('test@example.com', 'password123');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@loginRequest');
      cy.get('.fixed.inset-0').should('not.exist');
      cy.url().should('eq', 'http://localhost:3000/');
    });
  });

  describe('Registration Flow', () => {
    beforeEach(() => {
      openAuthModalDesktop();
      // Wait for modal to be fully visible
      cy.get('.fixed.inset-0').should('be.visible');
      // Click the registration link and wait for content update
      cy.contains('Need to create an account?')
        .should('be.visible')
        .click();
    });


    it('should successfully register new user', () => {
      const newUser = {
        email: 'newuser@example.com',
        password: 'password123',
        fname: 'John',
        lname: 'Doe',
        address: '123 Main St',
        postalCode: '12345',
        country: 'USA',
        city: 'New York',
        phonenum: '1234567890'
      };

      cy.intercept('POST', 'http://localhost:8080/user', {
        statusCode: 201,
        body: {
          email: newUser.email,
          id: 1
        }
      }).as('registerRequest');

      cy.intercept('POST', 'http://localhost:8080/tokens', {
        statusCode: 200,
        body: {
          userId: 1,
          email: newUser.email,
          isAdmin: false
        }
      }).as('loginAfterRegister');

      fillRegistrationForm(newUser);
      cy.get('button[type="submit"]').click();
      
      cy.wait('@registerRequest');
      cy.wait('@loginAfterRegister');
      
      cy.get('.fixed.inset-0').should('not.exist');
      cy.url().should('eq', 'http://localhost:3000/');
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
    });

    it('should open auth modal through mobile menu', () => {
      // Open mobile menu
      cy.get('.md\\:hidden button').click();
      
      // Click login in mobile menu
      cy.contains('Login').click();
      
      // Verify modal is open
      cy.get('.fixed.inset-0').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
    });
  });
});