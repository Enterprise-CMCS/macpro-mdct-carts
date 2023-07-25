Feature: CARTS Login Integration Test

    Scenario Outline: Authenticate as a State User
        Given I am logged in as a state user
        Then I am on "/"

        When I navigate to the user profile page
        Then the role is "STATE_USER"

        When I log out
        Then I see the login button

    Scenario Outline: Authenticate as a Admin User
        Given I am logged in as an admin user
        Then I am on "/"

        When I navigate to the user profile page
        And the role is "CMS_ADMIN"

        When I log out
        Then I see the login button