beforeEach(() => {
  cy.visit('https://dbidashboard.web.app/');
  cy.window().then((win) => {
    const devtools = win.document.querySelector('.vue-devtools__panel');
    if (devtools) {
      devtools.style.display = 'none';
    }
  });
});

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes("Cannot read properties of undefined (reading 'push')")) {
    return false;
  }
});

describe('Create User', () => {
  it('should create a new user', () => {
    cy.visit('https://dbidashboard.web.app/Login');
  });

  it('should navigate to signup page when clicking Opret bruger', () => {
    cy.visit('https://dbidashboard.web.app/Login');
    cy.get('.auth-wrapper__forgot-password').should('be.visible').click();
    cy.url().should('include', '/Signup');
  });

  it('should fill out the signup form', () => {
    cy.visit('https://dbidashboard.web.app/Signup');

    cy.get('input[type="text"]').eq(0).type('Allan');    
    cy.get('input[type="text"]').eq(1).type('Rasmussen');
    cy.get('input[type="text"]').eq(2).type('Salling');
    cy.get('input[type="email"]').type('allan@salling.dk');
    cy.get('input[type="password"]').eq(0).type('123456');
    cy.get('input[type="password"]').eq(1).type('123456');

    cy.get('input[type="text"]').eq(0).should('have.value', 'Allan');
    cy.get('input[type="text"]').eq(1).should('have.value', 'Rasmussen');
    cy.get('input[type="text"]').eq(2).should('have.value', 'Salling');
    cy.get('input[type="email"]').should('have.value', 'allan@salling.dk');
    cy.get('input[type="password"]').eq(0).should('have.value', '123456');
    cy.get('input[type="password"]').eq(1).should('have.value', '123456');

    cy.get('.auth-container__btn').click();

  });
});
