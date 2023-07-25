Feature: CARTS Submit and Uncertify Integration Tests

    Scenario Outline: Submit and Uncertify a Report
        Given I am logged in as an admin user
        Then I am on "/"

        When I uncertify an existing program
        Then I log out

        When I am logged in as a state user
        Then I certify and submit report
        And I log out

        When I am logged in as an admin user
        Then I uncertify a report
        And I log out

        When I am logged in as a state user
        Then the report should be "In Progress" again