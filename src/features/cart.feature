Feature: Shopping Cart in Sauce Demo

  Scenario: User adds product to cart 1
    Given the user logs in
    When the user adds the product "Sauce Labs Backpack" to the cart
    Then the product "Sauce Labs Backpack" should be visible in the cart
