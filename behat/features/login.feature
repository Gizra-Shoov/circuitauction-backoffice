Feature: Authentication
  Testing that the login form works.

  @javascript
  Scenario: Open dashboard for a staff user
    Given I login with user
    Then  I should see "Dashboard"

  @javascript
  Scenario: Fail login
    Given I try to login with bad credentials
    Then  I should see "Login Failed."
