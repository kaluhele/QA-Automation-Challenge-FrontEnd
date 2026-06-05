Feature: Checkout in Sauce Demo

  Scenario: User completes a purchase
    Given the user logs in
    And  the user adds the product "Sauce Labs Backpack" to the cart
    When the user proceeds to checkout with data "Juan" "Perez" "15001"
    Then the confirmation message "Thank you for your order!" should be visible
