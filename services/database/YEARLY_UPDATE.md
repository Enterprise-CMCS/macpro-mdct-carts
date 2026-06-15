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
3. In the seed-acs-2023 file, you will add the data from columns D-G in the ACS file (See [the readme](../../README.md) on how to find this). It will go in an array of object format that looks like this:

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
3. Add the data from the first table's rightmost column (The Enhanced federal medical assistance percentages). See [the readme](../../README.md) on how to find this
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
9. Using the seed-fmap.json file, ensure that the table here displays the same numbers as the seed-fmap.json file.

## Releasing the Form

Once the `services/database/data/seed/seed-section-base-{year}` form is created and ready to go, and you've updated the other areas to take note of it (Like `services/database/handlers/seed/tables/sectionBase.ts` and `/services/ui-src/src/store/globalVariables.js`), the time comes to release the form and test it generated correctly! To do that you will

1. Load up the PR's deployed branch (Or [mdctcartsdev.cms.gov](https://mdctcartsdev.cms.gov/) or other environment if its been merged)
2. Sign into CARTS as cms.admin@test.com
3. Click on the "Generate Form Base Templates" link on the homepage.
4. Select 2026 in the drop down. (If you don't see 2026, you missed a step!).
5. Click Generate New Section Forms
6. You'll likely see it sit there for 20 seconds. Don't worry! It is taking the template you created and distributing it out to all the states and territories we support.
7. You should received a "Task Complete" alert. If you do not, you'll need to investigate what went wrong
8. Assuming you did get a Task complete alert, head over to cloudtamer.cms.gov, sign into the mdct-carts-{env} environment, and double check in s3 that all of the reports have been generated. You can now also go to the homepage and see all the new reports listed out and scroll through them there.

## Updating the local seed

If you've generated the new form, you likely want a premade version that auto deploys in dev every single time you load up the dev environment. To do this,

1. Copy the seed-section-base-2026 file and put it into `services/database/data/seed-local/seed-section`.
2. Double check that the format is accurate (The keys "pk" and "stateId" need to be in each section. These values are not used in the seed-section-base file.. Search for "pk": "AL-2025" and "stateId": "AL" for reference.) Make sure everything references Alabama
3. After importing into seed-section, copy and paste the following into seed-status:

```json
  {
    "stateId": "AL",
    "status": "not_started",
    "year": 2025,
    "programType": "user",
    "username": "al@test.com",
    "lastChanged": "2025-09-30 09:30:00.000000+00"
  },
```

4. Make sure you update year and last changed to be your newly made year.
5. (Optional) Update the seed-acs and seed-fmap numbers with the new values as well.
