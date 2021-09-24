Feature: User login

    Scenario: User can edit 2020 in progress report
        Given user sees the 2020 report
        When  user clicks on the Edit link
        Then  user sees report edit page

