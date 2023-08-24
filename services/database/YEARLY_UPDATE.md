# MDCT CARTS Annual Form process

In order to add a new form to CARTS, a number of steps need to be manually taken, this walkthrough should make the bulk changes a little less intimidating.

## Add New Template

- `services/database/data/seed/` contains forms for distribution. Copy the most recent entry under a new name.
- Add the new file in `services/database/handlers/seed/tables/sectionBase.ts`

## Update Conditionals in the template

Conditionals in the template are declared as follows:

```json
"conditional_display": {
    "type": "conditional_display",
    "comment": "Interactive: Hide if 2022-01-a-01-01 is no or unanswered; noninteractive: hide if that's no.",
    "hide_if": {
        "target": "$..*[?(@ && @.id=='2022-01-a-01-01')].answer.entry",
        "values": {
            "interactive": [null, "no"],
            "noninteractive": ["no"]
        }
    }
}
```

- Note the target above, ` @.id=='2022-'` -> ` @.id=='2023-'`. This can be bulk find and replaced.
- May have some remaining comments to cleanup like `Interactive: Hide if 2022-03-i-01-01 is no; noninteractive: hide if that's no.`, just apply the same year change.

## Chip Enrollments

CHIP lookups are defined as followed

```json
{
    "lookupChipEnrollments": {
        "ffy": 2022,
        "enrollmentType": "Medicaid Expansion CHIP",
        "index": 1
    }
},
```

- Find and replace `"ffy": 2022,` -> `"ffy": 2023,`
- Update the headers section below the lookups to reference the new year
  Note this data comes from seds, and may not populate until test data is sent.

## Apply Content Changes

Other copy changes will need to be made to update instances of prior year in questions, or any requested changes. After the above changes were made about 100 instaces of the past year remain. Which include:

- labels / text
- Section 5 tables:
  - "id": "2023-05-a", headers
  - more section 5 headers
  - section 5 individual labels
  - eFmap targets need years aligned
  - eFmap $comment fields

## Add New PDF to the announcement Banner

- Add PDF to S3 Bucket
- Add PDF filename for 2023 in `services/app-api/types.ts`
- Update TemplateDownload.js with new file

## Code changes to allow new year for distribution and selection

- Add or update a LaunchDarkly flag for the new year
- Add the new year as an option in `/services/ui-src/src/components/layout/FormTemplates.js`, controlled by the flag
- `/services/ui-src/src/store/globalVariables.js` tracks the most recent year allowed in the app. This can safely be changed without a flag, just increment the year.
