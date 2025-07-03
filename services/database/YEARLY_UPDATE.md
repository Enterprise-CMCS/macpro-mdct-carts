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

CHIP lookups are defined as follows

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

### Update the ACS data

CARTS uses a separate handler to seed the FMAP and ACS Data. You'll need to do the following for ACS:

1. Navigate to the services/database/data/seed folder
2. Create a seed-acs-{enterYearHere}.json file (For example, you'd put seed-acs-2023) 
3. In the seed-acs-2023 file, you will add the data from columns D-G in the ACS file (See prior heading on how to find this). It will go in an array of object format that looks like this:

```
[
  {
    "stateId": "US",
    "year": 2023,
    "numberUninsured": 1987000,
    "numberUninsuredMoe": 44000,
    "percentUninsured": 2.6,
    "percentUninsuredMoe": 0.1
  },
  {
    "stateId": "AL",
    "year": 2023,
    "numberUninsured": 24000,
    "numberUninsuredMoe": 4000,
    "percentUninsured": 2.0,
    "percentUninsuredMoe": 0.4
  },
  ...
  ...
  ...
  {
    "stateId": "WY",
    "year": 2023,
    "numberUninsured": 4000,
    "numberUninsuredMoe": 1000,
    "percentUninsured": 2.8,
    "percentUninsuredMoe": 1.0
  }
]
```

4. In the services/database/handlers/seed/tables/index.js file, add `require("./acs-{enterYourYearHere}")` to the list
5. Create a file in services/database/handlers/seed/tables called `acs-{enterYourYearHere}.js`
6. In that newly created file paste this:

```
const seed = {
  name: "ACS {enterYourYearHere}",
  data: require("../../../data/seed/seed-acs-{enterYourYearHere}.json"),
  tableNameBuilder: (stage) => `${stage}-acs`,
  keys: ["stateId", "year"],
};

module.exports = seed;
```
7. Create and PR and deploy the application
8. Open the deployed instance 
9. Open up a associated year's report
10. Navigate to Section 2, Part 2
11. Using the seed-acs-2023.json file, note that the table here has the exact same numbers as the seed file.

### Update the FMAP data

CARTS uses a separate handler to seed the FMAP and ACS Data. FMAP follows a similar process to ACS. You'll need to do the following for FMAP:

1. Navigate to the services/database/data/seed folder
2. Open the seed-fmap.json file 
3. Add the data from the first table's rightmost column (The Enhanced federal medical assistance percentages). See prior heading for how to find this page.
4. Unlike ACS, all the data is located in this one file. Append the latest year's data to the bottom of the array. The format for this data is as follows:

```
[
  {
    "stateId": "WY",
    "fiscalYear": 2024,
    "enhancedFmap": 65.0
  },
  {
    "stateId": "AL",
    "fiscalYear": 2025,
    "enhancedFmap": 80.99
  },
  {
    "stateId": "AK",
    "fiscalYear": 2025,
    "enhancedFmap": 66.08
  },
  ...
  ...
  ...
  {
    "stateId": "WY",
    "fiscalYear": 2025,
    "enhancedFmap": 65.0
  }
]
```

5. Merge this change and deploy the application
6. Open the deployed instance 
7. Open up an associated year's report
8. Navigate to Section 5, Part 2 Table 3 (Federal and State Shares Table)
9. Using the seed-fmap.json file, note that the table here has the exact same numbers for 2025 as the seed file.