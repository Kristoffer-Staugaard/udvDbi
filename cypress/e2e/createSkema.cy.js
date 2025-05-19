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

// Custom command for login
Cypress.Commands.add('login', (email, password) => {
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('.auth-wrapper__login-button').click();
});

describe('Create Skema', () => {
  it('should login successfully', () => {
    cy.login('allan@salling.dk', '123456');
  });

  it('should navigate to skemaer page', () => {
    cy.login('allan@salling.dk', '123456');
    cy.get('img[alt="skemaer icon"]').click();
  });

  it('should navigate to complete schedule page', () => {
    cy.login('allan@salling.dk', '123456');
    cy.get('img[alt="skemaer icon"]').click();
    cy.get('.dropdown').click();
    cy.get('a[href="/CompleteSchedule"]').click();
  });

  it('should fill out the schedule form', () => {
    cy.login('allan@salling.dk', '123456');
    cy.get('img[alt="skemaer icon"]').click();
    cy.get('.dropdown').click();
    cy.get('a[href="/CompleteSchedule"]').click();

    // Fill out the form
    cy.get('#title').type('Test Schedule Title');
    cy.get('#date').type('2024-03-20');
    cy.get('input[value="yes"]').first().click();
    cy.get('textarea').eq(1).type('Test error comment');
    cy.get('input[value="no"]').last().click();
    cy.get('textarea').eq(2).type('Test system comment');

    // Click the "Gem og luk" button
    cy.contains('button', 'Gem og luk').click();
  });
});
