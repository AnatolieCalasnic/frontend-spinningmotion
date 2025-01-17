// cypress/e2e/home.cy.js
describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })


  it('should display new releases', () => {
    cy.contains('NEW RELEASES').should('be.visible')
  })

  it('should have working newsletter signup', () => {
    cy.contains('JOIN OUR MAILING LIST').should('be.visible')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('button').contains('Subscribe').click()
  })
})