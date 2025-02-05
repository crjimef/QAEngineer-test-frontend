import React from "react";
import App from "./App";

describe('App Component', () => {
  beforeEach(() => {
    cy.mount(<App />);
  });

  it('renders the login form', () => {
    cy.contains('Login').should('exist');
    cy.get('input[placeholder="Email"]').should('exist');
    cy.get('input[placeholder="Password"]').should('exist');
    cy.get('button.submit_button').should('exist');
  });

  it('updates email and password fields', () => {
    cy.get('input[placeholder="Email"]').type('test@example.com').should('have.value', 'test@example.com');
    cy.get('input[placeholder="Password"]').type('1234').should('have.value', '1234');
  });

  it('handles successful login', () => {
    cy.intercept('POST', 'http://localhost:3001/login', {
      statusCode: 200,
      body: { message: 'Login successful!' }
    }).as('loginRequest');

    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('1234');
    cy.get('button.submit_button').click();
    
    cy.wait('@loginRequest');
    cy.contains('¡Bienvenido!').should('exist');
  });

  it('handles failed login', () => {
    cy.intercept('POST', 'http://localhost:3001/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('loginRequest');

    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('wrongpassword');
    cy.get('button.submit_button').click();
    
    cy.wait('@loginRequest');
    cy.contains('Invalid credentials').should('exist');
  });

  it('handles network error', () => {
    cy.intercept('POST', 'http://localhost:3001/login', {
      forceNetworkError: true
    }).as('loginRequest');

    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('1234');
    cy.get('button.submit_button').click();
    
    cy.wait('@loginRequest');
    cy.contains('Error al conectar con el servidor').should('exist');
  });

  it('does not submit the form if email or password is empty', () => {
    cy.get('button.submit_button').click();
    cy.intercept('POST', 'http://localhost:3001/login').should('not.exist');
  });

  it('does not submit the form if email is invalid', () => {
    cy.get('input[placeholder="Email"]').type('correo-invalido');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button.submit_button').click();
    cy.intercept('POST', 'http://localhost:3001/login').should('not.exist');
  });

  it('calls fetch with correct data', () => {
    cy.intercept('POST', 'http://localhost:3001/login', (req) => {
      expect(req.body).to.deep.equal({
        email: 'test@example.com',
        password: '1234',
      });
      req.reply({ statusCode: 200, body: { message: 'Login successful!' } });
    }).as('loginRequest');

    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('1234');
    cy.get('button.submit_button').click();
    
    cy.wait('@loginRequest');
  });

  it('handles successful logout', () => {
    cy.intercept('POST', 'http://localhost:3001/login', {
      statusCode: 200,
      body: { message: 'Login successful!' }
    }).as('loginRequest');

    cy.intercept('POST', 'http://localhost:3001/logout', {
      statusCode: 200,
      body: { message: 'Logout successful!' }
    }).as('logoutRequest');

    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('1234');
    cy.get('button.submit_button').click();
    cy.wait(1000);
    cy.contains('¡Bienvenido!').should('exist');
    cy.get('button.submit_button').contains('Logout').click();
    
    cy.wait('@logoutRequest');
    cy.contains('Login').should('exist');
  });

  it('handles logout error', () => {
    cy.intercept('POST', 'http://localhost:3001/login', {
      statusCode: 200,
      body: { message: 'Login successful!' }
    }).as('loginRequest');

    cy.intercept('POST', 'http://localhost:3001/logout', {
      statusCode: 500,
      body: { message: 'Logout failed' }
    }).as('logoutRequest');

    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('1234');
    cy.get('button.submit_button').click();
    
    cy.contains('¡Bienvenido!').should('exist');
    cy.get('button.submit_button').contains('Logout').click();
    
    cy.wait('@logoutRequest');
    cy.contains('Logout failed').should('exist');
  });
});
