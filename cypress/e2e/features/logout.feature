Feature: User Logout
  As a user, I want to log out of the system to protect my account and exit the application.

  Scenario: Successful logout
    Given the user is authenticated and on wellcome page
    When clicks the "Logout" button
    Then the system must log out the user
    And the system should automatically redirect user to the login page

    Scenario: Server is down during login attempt
    Given the user is authenticated and on wellcome page
    And the server's "/logout" endpoint is down
    When clicks the "Logout" button
    Then the system should display an error message saying "Error al cerrar sesión"