import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("the user is authenticated and on wellcome page", function () {
    cy.fakeLogin();
    cy.contains('¡Bienvenido!').should('be.visible');
});

Then("the system must log out the user", () => {
    cy.wait('@logoutRequest').its('response.statusCode').should('eq', 200);
});

Then("the system should automatically redirect user to the login page", () => {
    cy.contains("Login").should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
});

beforeEach(() => {
    cy.intercept('POST', '/logout', (req) => {
        req.reply({ statusCode: 200, body: { fixture: 'successfulLogout.json' } });
    }).as('logoutRequest');
});