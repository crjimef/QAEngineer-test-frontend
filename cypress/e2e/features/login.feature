Feature: User Login
  As a user, I want to log into the system to access my profile and personalized features.

  Scenario: Successful login
    Given the user is on the login page
    When the user enters a valid email and password
    And clicks the "Login" button
    Then the system should authenticate the user
    And redirect them to the welcome page

  Scenario: Failed login due to incorrect credentials
    Given the user is on the login page
    When the user enters an incorrect email or password
    And clicks the "Login" button
    Then the system should display an error message saying "Incorrect credentials"

  Scenario: Failed login due to both fields being empty
    Given the user is on the login page
    When the user leaves both fields empty
    And clicks the "Login" button
    Then the login request should not be sent
    And The user verifies that he is on the login page

  Scenario: Failed login due to empty email
    Given the user is on the login page
    When the user leaves the email field empty and enters a valid password
    And clicks the "Login" button
    Then the login request should not be sent
    And The user verifies that he is on the login page

  Scenario: Failed login due to empty password
    Given the user is on the login page
    When the user enters a valid email and leaves the password field empty
    And clicks the "Login" button
    Then the login request should not be sent
    And The user verifies that he is on the login page

  Scenario: Server is down during login attempt
    Given the user is on the login page
    And the server's "/login" endpoint is down
    When the user enters a valid email and password
    And clicks the "Login" button
    Then the system should display an error message saying "Error al conectar con el servidor"