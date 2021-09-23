Feature: TEST


    Scenario: QMR Home is displayed to the user
        Given user visits QMR home page
        When  QMR home page is displayed to the user
        Then  user can see "APS Submission App" page banner
        And   user can see login link
        And   user can see the footer

    Scenario: User can login to QMR
        Given user visits QMR home page
        When  user clicks on "Login" link
        And   user enter username and password
        And   user click "Sign In" button
        Then  user should see the QMR home page

    Scenario: QMR Landing page is displayed to the user
        Given user visits QMR home page
        When  QMR landing page is displayed to the user
        Then  user can see "Your APS Submissions" page banner
        And   user can see My Account link
        And   user can see the footer