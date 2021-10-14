Feature: User verify 2020 form

    # done
    Scenario: User can edit 2020 in progress report
        Given user sees the 2020 report
        When  user clicks on the Edit link
        Then  user sees report edit page

    # done
    Scenario: User verify Basic State Information page
        Given user sees the 2020 report
        When  user clicks on the Edit link
        And  user clicks on the Basic State Information link
        Then  user sees the Welcome title
        And   verify "Alabama" is entered for state territory name
        And   verify "Both medicaid Expansion CHIP and Separate CHIP" is selected for Program type
        And   verify "ALL Kids" is entered for CHIP program name
        And   verify "Teela Sanders" is entered for Contact name
        And   verify "Director" is entered for Job title
        And   verify "teela.sanders@adph.state.al.us" is entered for Email
        And   verify "Alabama Department of Public Health, CHIP PO Box 303017 Montgomery, AL 36130" is entered for Full mailling address
        And   verify "334-206-5568" is entered for Phone number
        And   verify PRA Disclosure Statement is presented
        And   verify Next button is presented

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


    Scenario: User verify Section 3C: Renewal Denials, and Retention
        Given user see the 2020 report
        When  user clicks on the Section 3C: Renewal Denials, and Retention
        Then  user sees the Renewal Denials, and Retention title
        And   verify information in Part1
        And   verify information in Part2
        And   verify information in Part3
        And   verify information in Part4
        And   verify information in Part5
        And   verify information in Part6
        And   verify Next button is presented
        And   verify Previous button is presented


    Scenario: User verify Section 3D: Cost Sharing (Out-of-Pocket Costs)
        Given user see the 2020 report
        When  user clicks on the Section 3D: Cost Sharing (Out-of-Pocket Costs)
        Then  user sees the Cost Sharing (Out-of-Pocket Costs) title
        And   verify text under title
        And   verify Next button is presented
        And   verify Previous button is presented


    Scenario: User verify Section 3E: Employer Sponsored Insurance and Premium Assistance
        Given user see the 2020 report
        When  user clicks on the Section 3E: Employer Sponsored Insurance and Premium Assistance
        Then  user sees the Employer Sponsored Insurance and Premium Assistance title
        And   verify selected No for Part1 question 1
        And   verify information in Part2
        And   verify Next button is presented
        And   verify Previous button is presented


    Scenario: User verify Section 3F: Program Integrity
        Given user see the 2020 report
        When  user clicks on the Section 3F: Program Integrity
        Then  user sees the Program Integrity title
        And   verify selected No for question 1
        And   verify selected No for question 2
        And   verify selected No for question 3
        And   verify text is entered in question 4
        And   verify N/A is selected in question 5
        And   verify data is entered for question 6
        And   verify data is entered for question 7
        And   verify data is entered for question 8
        And   verify data is entered for question 9
        And   verify data is entered for question 10
        And   verify data is entered for question 11
        And   verify data is entered for question 12
        And   verify data is entered for question 13
        And   verify Medicaid and CHIP combined is selected for question 14
        And   verify selected Yes for question 15
        And   verify text is entered in question 15a
        And   verify selected No for question 16
        And   verify text is entered in question 17
        And   verify Choose Files button is presented in question 18
        And   verify Hide Uploaded button is presented in question 18
        And   verify Next button is presented
        And   verify Previous button is presented


    Scenario: User verify Section 3G: Dental Benefits
        Given user see the 2020 report
        When  user clicks on the Section 3G: Dental Benefits
        Then  user sees the Dental Benefits title
        And   verify selected Yes for question 1
        And   verify data is entered for question 2
        And   verify data is entered for question 3
        And   verify data is entered for question 4
        And   verify data is entered for question 5
        And   verify data is entered for question 6
        And   verify selected No for question 7
        And   verify text is entered in question 8
        And   verify Choose Files button is presented in question 9
        And   verify Hide Uploaded button is presented in question 9
        And   verify Next button is presented
        And   verify Previous button is presented


    Scenario: User verify Section 3H: CAHPS Survey Results
        Given user see the 2020 report
        When  user clicks on the Section 3H: CAHPS Survey Results
        Then  user sees the CAHPS Survey Results title
        And   verify selected Yes for Part1 question 1
        And   verify selected Yes for Part1 question 1a
        And   verify Choose Files button is presented in Part2 question 1
        And   verify Hide Uploaded button is presented in Part2 question 2
        And   verify Separate CHIP is selected for Part2 question 2
        And   verify CAHPS 5.0H is selected for Part2 question 3
        And   verify Children with Chronic Conditions is selected for Part2 question 4
        And   verify NCQA HEDIS CAHPS 5.0H is selected for Part2 question 5
        And   verify text is entered for Part2 question 6
        And   verify Next button is presented
        And   verify Previous button is presented


    Scenario: User verify Section 3I: Health Services Initiative (HSI) Programs
        Given user see the 2020 report
        When  user clicks on the Section 3I: Health Services Initiative (HSI) Programs
        Then  user sees the Health Services Initiative (HSI) Programs title
        And   verify Part1 question 1
        And   verify the information in Part2
        And   verify Next button is presented
        And   verify Previous button is presented


    Scenario: User verify Section 4: State Plan Goals and Objectives
        Given user see the 2020 report
        When  user clicks on the Section 4: State Plan Goals and Objectives
        Then  user sees the State Plan Goals and Objectives title
        And   verify information in textarea 
        And   verify information in text inputs
        And   verify information in radio inputs
        And   verify information in upload button 
        And   verify information in hide upload button
        And   verify information in delete last item button 
        And   verify information in add another item button
        And   verify information in all labels


    Scenario: User verify Section 5: Program Financing
        Given user see the 2020 report
        When  user clicks on the Section 5: Program Financing
        Then  user sees the Program Financing title
        And   verify section 5 information in Part1
        And   verify section 5 information in Part2
        And   verify section 5 information in Part3
        And   verify section 5 information in Part4
        And   verify section 5 information in Part5
        And   verify Next button is presented
        And   verify Previous button is presented


    Scenario: User verify Section 6: Challenges and Accomplishments
        Given user see the 2020 report
        When  user clicks on the Section 6: Challenges and Accomplishments
        Then  user sees the Challenges and Accomplishments title
        And   verify text in question 1
        And   verify text in question 2
        And   verify text in question 3
        And   verify text in question 4
        And   verify text in question 5
        And   verify Choose Files button is presented in question 6
        And   verify Hide Uploaded button is presented in question 6
        And   verify Next button is presented
        And   verify Previous button is presented


    Scenario: User verify Certify and Submit
        Given user see the 2020 report
        When  user clicks on the Certify and Submit
        Then  user sees the Certify and Submit title
        And   verify Cerify and Submit button is displayed