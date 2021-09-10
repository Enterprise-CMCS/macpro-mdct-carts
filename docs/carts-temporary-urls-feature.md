# CARTS Temporary URLs Feature

### Summary

State users could select a section of the form that they would like colleagues to fill out, and generate a temporary URL for that section. They would then pass that URL to the colleague in question, who would be able to access and submit the form via the URL without needing to log into the system via other means. The URL would only work for a limited time, probably a week, or until that section of the form has been submitted by the temporary user. The state user would then be able to see the entered information and review/validate it.

### Context

CARTS state users often need to request information from colleagues who don't have access to the system. Since the involvement of those colleagues with CARTS is otherwise minimal, it's not feasible to have them go through the CMS EUA ID account creation process. The state users typically deal with this by passing Word documents around via email and collating the answers, an inefficient and cumbersome process.

### Technical Outline

The system would support a special type of user account that would:

- Not require any account information, such as name or email address.
- Only be active for a limited period, likely seven days.
- Have randomly-generated usernames.
- Store the email address/name of the user who generated them.
- Not display their usernames, but where users would typically see their own details, the system would display something like Temporary account, valid until [date], created by [state user].
- Have permissions that specified access to a particular section, and denied access to any other parts of the system.

The feature from the state user perspective would include the following:

- State users would see a UI, probably visible from each section, allowing them to generate a temporary URL.
- In order to generate a temporary URL, state users would have to enter the email address of the user they intend to send the temporary URL to. The system would not do the sending, and thus could not guarantee that the state user sends it to that email address.
- Only one temporary URL per section would be permitted at one time, to minimize potential input conflicts.
- Once a state user generates a temporary URL, that state user would no longer be able to edit sections that have active temporary URLs, but could see them, and would see information in the UI reminding them that they had generated the temporary URL.
- State users would be able to cancel the temporary URL via the UI. If the temporary user submits the URL, this would deactivate the temporary URL and the state user would receive an email notification.

## Security Rationale

- The potential for data leakage is low.
- The worst-case scenario is both unlikely and not particularly severe.
- The data in question is all going to be public later anyway.
- This approach should be able to support at least a weak audit trail.
- The focus should be on the security of the overall system, not just security of the website.
- Not providing functionality along these lines means the overall system is weaker in terms of convenience, data integrity, and security.

### The potential for data leakage is low.

Potential data leakage here is highly limited: an unauthorized user getting the temporary URL would be able to either see nothing (because the point of it is to let the state user pass a section along to someone else for the someone else to fill out) or see data that will become public anyway once the report is published on medicaid.gov.

### The worst-case scenario is both unlikely and not particularly severe.

The worst-case scenario is that the unauthorized user enters spurious data. However, the state user will review the data in any case, so this is unlikely to go unnoticed. This means that the only problematic case would be where the URL somehow made its way to someone who was sufficiently knowledgeable in the area to be able to convincingly spoof the data, which seems rather unlikely.

### The data in question is all going to be public later anyway.

Everything entered into the form will be published on medicaid.gov later in the year, so any leak of the data would either be of data that will later be entirely public, or data that was inaccurate and corrected later.

### This approach should be able to support at least a weak audit trail.

The process requires the state user to enter the email address of who they intend to send the URL to, providing at least a weak audit trail.

### The focus should be on the security of the overall system, not just security of the website.

Declining to include this functionality will not increase overall security, even if it increases the security of just the application—the overall system includes user behavior around passing documents/data to and from individuals who do not have accounts. This will happen in entirely untracked ways if we don’t provide this functionality or some other way to address the needs that the users are currently meeting via passing documents around in emails. When considering the system as a whole—not just the technical definition of the website—adding this functionality will improve security, not diminish it.

### Not providing functionality along these lines means the overall system is weaker in terms of convenience, data integrity, and security.

Current status quo involves passing around Word docs, which is problematic from convenience, security, and data integrity viewpoints. Moving to this approach would hopefully be more convenient, and if more convenient would push user adoption, thus reducing the current email-based behavior and thereby increasing security and data integrity. It would improve data integrity because the current email-based approach has no version control and users report occasional confusion over what data is newly-added versus old, and other similar issues.
