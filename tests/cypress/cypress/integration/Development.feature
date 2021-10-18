
Feature: User verify 2020 form

    Background: User logs in
        Given user visits Carts home page
        And  logins with valid username and password
        And  user can see Carts landing page


    Scenario: User verify Section 3C: Renewal Denials, and Retention
        Given user sees the 2020 report
        When  user clicks on the Section 3C: Renewal Denials, and Retention
        Then  user sees the Renewal Denials, and Retention title
         And verify section 3c information in textarea 
         And verify section 3c disabled text inputs 
         And verify section 3c enabled text inputs
         And verify section 3c tables 
         And verify section 3c radio button lables 
