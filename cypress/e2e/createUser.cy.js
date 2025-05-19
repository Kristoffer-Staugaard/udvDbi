// Hide Vue DevTools before each test
beforeEach(() => {
  cy.visit('http://localhost:5173/Login');
  // Hide Vue DevTools panel
  cy.window().then((win) => {
    const devtools = win.document.querySelector('.vue-devtools__panel');
    if (devtools) {
      devtools.style.display = 'none';
    }
  });
});

describe('Create User', () => {
  it('should create a new user', () => {
    cy.visit('http://localhost:5173/Login');
  });

  it('should navigate to signup page when clicking Opret bruger', () => {
    cy.visit('http://localhost:5173/Login');
    cy.get('.auth-wrapper__forgot-password').click();
    cy.url().should('include', '/Signup');
  });

  it('should fill out the signup form', () => {
    cy.visit('http://localhost:5173/Signup');

    // Fill out all form fields
    cy.get('input[type="text"]').eq(0).type('John'); // First name
    cy.get('input[type="text"]').eq(1).type('Doe'); // Last name
    cy.get('input[type="text"]').eq(2).type('Test Company'); // Company name
    cy.get('input[type="email"]').type('john.doe@example.com');
    cy.get('input[type="password"]').eq(0).type('password123');
    cy.get('input[type="password"]').eq(1).type('password123');

    // Verify all fields are filled
    cy.get('input[type="text"]').eq(0).should('have.value', 'John');
    cy.get('input[type="text"]').eq(1).should('have.value', 'Doe');
    cy.get('input[type="text"]').eq(2).should('have.value', 'Test Company');
    cy.get('input[type="email"]').should('have.value', 'john.doe@example.com');
    cy.get('input[type="password"]').eq(0).should('have.value', 'password123');
    cy.get('input[type="password"]').eq(1).should('have.value', 'password123');

    cy.get('.auth-container__btn').click();

  });
});
