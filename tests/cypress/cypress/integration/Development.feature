
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
        And   verify selected No for question 1 enrollment fee
        And   verify selected No for question 2 charge premiums
        And   verify selected No for question 3 maximum premium
        And   verify "N/A" is entered for question 4 explain the fee structure breakdown
        And   verify selected Primary Care Case Management for question 5 delivery system
        And   verify "N/A" is entered for question 6
        And   verify selected No for Part2 question 1
        And   verify selected Yes for Part2 question 2
        And   verify selected Yes for Part2 question 2a
        And   verify "141.0" is entered for Part2 question 2b FPL starts at
        And   verify "312.0" is entered for Part2 question 2b FPL ends at
        And   verify "52" is entered for Part2 question 2b Premium starts at
        And   verify "104" is entered for Part2 question 2b Premium ends at
        And   verify button Add another is presented for Part2 question 2b
        And   verify selected Yes for Part2 question 3
        And   verify "141.0" is entered for Part2 question 3a FPL starts at
        And   verify "312.0" is entered for Part2 question 3a FPL ends at
        And   verify "52" is entered for Part2 question 3a Premium starts at
        And   verify "104" is entered for Part2 question 3a Premium ends at
        And   verify button Add another is presented for Part2 question 3a
        And   verify text is entered for Part2 question 4
        And   verify Fee for Service is selected for Part2 question 5
        And   verify N/A is entered for Part2 question 6
        And   verify selected No for Part3 question 1
        And   verify selected No for Part3 question 2
        And   verify selected No for Part3 question 3
        And   verify selected No for Part3 question 4
        And   verify selected No for Part3 question 5
        And   verify selected No for Part3 question 6
        And   verify selected No for Part3 question 7
        And   verify selected No for Part3 question 8
        And   verify selected No for Part3 question 9
        And   verify selected No for Part3 question 10
        And   verify selected No for Part3 question 11
        And   verify selected No for Part3 question 12
        And   verify selected No for Part3 question 13
        And   verify selected No for Part3 question 14
        And   verify selected No for Part3 question 15
        And   verify selected No for Part3 question 16
        And   verify selected No for Part4 question 1
        And   verify selected No for Part4 question 2
        And   verify selected No for Part4 question 3
        And   verify selected No for Part4 question 4
        And   verify selected No for Part4 question 5
        And   verify selected No for Part4 question 6
        And   verify selected No for Part4 question 7
        And   verify selected No for Part4 question 8
        And   verify selected No for Part4 question 9
        And   verify selected No for Part4 question 10
        And   verify selected No for Part4 question 11
        And   verify selected No for Part4 question 12
        And   verify selected No for Part4 question 13
        And   verify selected No for Part4 question 14
        And   verify selected No for Part4 question 15
        And   verify selected No for Part4 question 16
        And   verify selected No for Part4 question 17
        And   verify selected No for Part4 question 18
        And   verify selected No for Part4 question 19
        And   verify Next button is presented
        And   verify Previous button is presented