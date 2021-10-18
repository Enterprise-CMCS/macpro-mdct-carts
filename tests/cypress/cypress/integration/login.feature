Feature: User login

    Scenario: Carts user can login with valid credentials
        Given user visits Carts home page
        And  logins with valid username and password
        And  user can see Carts landing page