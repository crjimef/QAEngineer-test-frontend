import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("the user is on the login page", () => {
  cy.visit('/login');
});

When("the user enters a valid email and password", () => {
  cy.get('input[type="email"]').type('test@example.com');
  cy.get('input[type="password"]').type('1234');
});

When("the user enters an incorrect email or password", () => {
  cy.get('input[type="email"]').type('wrong@example.com');
  cy.get('input[type="password"]').type('wrongpassword');
});

When("the user leaves both fields empty", () => {
  cy.get('input[type="email"]').clear();
  cy.get('input[type="password"]').clear();
});

When("the user leaves the email field empty and enters a valid password", () => {
  cy.get('input[type="email"]').clear();
  cy.get('input[type="password"]').type('1234');
});

When("the user enters a valid email and leaves the password field empty", () => {
  cy.get('input[type="email"]').type('test@example.com');
  cy.get('input[type="password"]').clear();
});

When("clicks the {string} button", (buttonText) => {
  cy.contains("button", buttonText).click();
});

Then("the system should authenticate the user", () => {
  cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
});

Then("redirect them to the welcome page", () => {
  cy.contains('¡Bienvenido!').should('be.visible');
}); 

Then("The user verifies that he is on the login page", () => {
  cy.contains("Login").should('be.visible');
  cy.get('input[type="email"]').should('be.visible');
  cy.get('input[type="password"]').should('be.visible');
});

Then("the system should display an error message saying {string}", (errorMessage) => {
  cy.contains(errorMessage).should('be.visible');
});

Then("the login request should not be sent", () => {
  cy.intercept('POST', '/login').as('loginRequest');
  cy.wait(1000);
  cy.get("@loginRequest").should('not.exist');
});

// Simulación de errores del servidor
Given("the server's {string} endpoint is down", (endpoint) => {
  cy.intercept('POST', endpoint, {
    forceNetworkError: true
  }).as('serverDownRequest');
});

// Interceptar solo las peticiones que sí deben enviarse al servidor
beforeEach(() => {
  cy.intercept('POST', '/login', (req) => {
    if (req.body.email === 'test@example.com' && req.body.password === '1234') {
      req.reply({ statusCode: 200, body: { token: "fake-token", user: { email: "test@example.com", name: "Test User" } } });
    } else {
      req.reply({ statusCode: 401, body: { message: "Incorrect credentials" } });
    }
  }).as('loginRequest');
});