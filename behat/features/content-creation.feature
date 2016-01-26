Feature: Content creation
  In order to be able to create content
  As an login user
  We need to be able to have ability to create a content

  @javascript
  Scenario: Create a new client.
    Given I visit the new client form with user
    When  I should Fill out and save the client form
    Then  I should Be able to see the new client


  @javascript
  Scenario: Create a new consignments.
    Given I visit the new consignments
    When  I should Fill out and save the consignments form
    Then  I should Be able to see the new consignments

  @javascript
  Scenario: Create a new item.
    Given I visit the new item
    When  I should Fill out and save the item form
    Then  I should Be able to see the new item
