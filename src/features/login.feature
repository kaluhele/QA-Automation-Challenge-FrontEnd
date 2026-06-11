Feature: Login in Sauce Demo

  Scenario: Valid user logs in properly
    Given the user navigates to the login page
    When they enter credentials "VALID_USERNAME" and "VALID_PASSWORD"
    Then they should see the products page

  Scenario: Locked out user does not log in properly
    Given the user navigates to the login page
    When they enter credentials "LOCKED_USERNAME" and "LOCKED_PASSWORD"
    Then they should see an error message

  Scenario: Invalid user does not log in properly
    Given the user navigates to the login page
    When they enter credentials "INVALID_USERNAME" and "INVALID_PASSWORD"
    Then they should see an error message

  Scenario: Scenario SHOULD fail
    Given the user navigates to the login page
    When they enter credentials "VALID_USERNAME" and "INVALID_PASSWORD"
    Then they should see the products page

@skip
  Scenario: Scenario SHOULD Skip
    Given the user navigates to the login page
    When they enter credentials "VALID_USERNAME" and "INVALID_PASSWORD"
    Then they should see the products page
