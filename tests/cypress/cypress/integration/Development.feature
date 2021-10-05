
Feature: User verify 2020 form

    Background: User logs in
        Given user visits Carts home page
        And  logins with valid username and password
        And  user can see Carts landing page



    Scenario: User verify Section 1: Program Fees and Policy Changes page
        Given user sees the 2020 report
        When  user clicks on the Edit link
        When  user clicks on the Section 1: Program Fees and Policy Changes link
        Then  user sees the Program Fees and Policy Changes title
        And   verify information in Part 1
        And   verify information in Part 2
        And   verify information in Part 3
        And   verify information in Part 4
        And   verify Next button is presented
        And   verify Previous button is presented



    
    Scenario: User verify Section 2: Enrollment and Uninsured Data
        Given user see the 2020 report
        When  user clicks on the Section 2: Enrollment and Uninsured Data
        Then  user sees the Enrollment and Uninsured Data title
        And   verify information in Part 1
        And   verify information in Part 2
        And   verify Next button is presented
        And   verify Previous button is presented


    Scenario: User verify Section 3A: Program Outreach
        Given user see the 2020 report
        When  user clicks on the Section 3A: Program Outreach
        Then  user sees the Program Outreach title
        And   verify selected No for question 1
        And   verify selected No for question 2
        And   verify text is entered in question 3
        And   verify text is entered in question 4
        And   verify Choose Files button is presented in Part2 question 5
        And   verify Hide Uploaded button is presented in Part2 question 5
        And   verify Next button is presented
        And   verify Previous button is presented


    Scenario: User verify Section 3B: Substitution of Coverage
        Given user see the 2020 report
        When  user clicks on the Section 3B: Substitution of Coverage
        Then  user sees the Substitution of Coverage title
        And   verify selected No for question 1
        And   verify selected No for question 2
        And   verify data enter box for question 3
        And   verify text is entered in question 5
        And   verify Choose Files button is presented in question 6
        And   verify Hide Uploaded button is presented in question 6
        And   verify Next button is presented
        And   verify Previous button is presented


    Scenario: User verify Section 3D: Cost Sharing (Out-of-Pocket Costs)
        Given user see the 2020 report
        When  user clicks on the Section 3D: Cost Sharing (Out-of-Pocket Costs)
        Then  user sees the Cost Sharing (Out-of-Pocket Costs) title
        And   verify text under title
        And   verify Next button is presented
        And   verify Previous button is presented
