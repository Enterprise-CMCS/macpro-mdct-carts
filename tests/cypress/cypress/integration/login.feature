Feature: User login

    Scenario: Carts user can login with valid credentials
        Given user visits Carts home page
        When  logins with valid username and password
        Then  user can see Carts landing page

