import { AppRoles } from "../types";

export const stateUserSimple = {
  stateUser: {
    currentUser: {
      email: "garthVader@DeathStarInc.com",
      username: "garthVader",
      firstname: "Garth",
      lastname: "Vader",
      role: "",
      state: {
        id: "",
      },
    },
  },
  global: {
    currentYear: 2077,
  },
  save: {
    error: false,
    saving: false,
  },
  reportStatus: {},
};

export const stateUserNoUsername = {
  stateUser: {
    currentUser: {
      email: "garthVader@DeathStarInc.com",
      username: "",
      firstname: "",
      lastname: "",
      role: "",
      state: {
        id: "",
      },
    },
  },
  global: {
    currentYear: 2077,
  },
  save: {
    error: false,
    saving: false,
  },
  reportStatus: {},
};

export const stateUserWithReportInProgress = {
  stateUser: {
    name: "Alabama",
    abbr: "AL",
    imageURI: "/img/states/al.svg",
    currentUser: {
      username: "stateuser2@test.com",
      state: {
        id: "AL",
      },
      role: AppRoles.STATE_USER,
      lastname: "States",
      firstname: "Frank",
      email: "stateuser2@test.com",
    },
    localLogin: false,
  },
  global: {
    formName: "CARTS FY",
    largeTextBoxHeight: 6,
    isFetching: false,
    url: "/sections/2021/00",
    queryParams: "",
    currentYear: 2021,
    formYear: 2021,
    stateName: "Alabama",
  },
  reportStatus: {
    AL2021: {
      status: "in_progress",
      year: 2021,
      stateCode: "AL",
      lastChanged: "Mon Jun 27 2022 12:24:11 GMT-0400 (Eastern Daylight Time)",
      username: "al@test.com",
      programType: "combo",
    },
  },
  save: {
    error: false,
    saving: false,
  },
};

export const stateUserWithReportCertified = {
  stateUser: {
    name: "Alabama",
    abbr: "AL",
    imageURI: "/img/states/al.svg",
    currentUser: {
      username: "stateuser2@test.com",
      state: {
        id: "AL",
      },
      role: AppRoles.STATE_USER,
      lastname: "States",
      firstname: "Frank",
      email: "stateuser2@test.com",
    },
    localLogin: false,
  },
  global: {
    formName: "CARTS FY",
    largeTextBoxHeight: 6,
    isFetching: false,
    url: "/sections/2021/00",
    queryParams: "",
    currentYear: 2021,
    formYear: 2021,
    stateName: "Alabama",
  },
  reportStatus: {
    AL2021: {
      status: "certified",
      year: 2021,
      stateCode: "AL",
      lastChanged: "2021-01-04 18:28:18.524133+00",
      username: "al@test.com",
      programType: "combo",
    },
  },
  save: {
    error: false,
    saving: false,
  },
};

export const stateUserWithMultipleReports = {
  stateUser: {
    name: "Alabama",
    abbr: "AL",
    imageURI: "/img/states/al.svg",
    currentUser: {
      username: "stateuser2@test.com",
      state: {
        id: "AL",
      },
      role: AppRoles.STATE_USER,
      lastname: "States",
      firstname: "Frank",
      email: "stateuser2@test.com",
    },
    localLogin: false,
  },
  global: {
    formName: "CARTS FY",
    largeTextBoxHeight: 6,
    isFetching: false,
    url: "/sections/2021/00",
    queryParams: "",
    currentYear: 2021,
    formYear: 2021,
    stateName: "Alabama",
  },
  reportStatus: {
    AL2021: {
      status: "in_progress",
      year: 2021,
      stateCode: "AL",
      lastChanged: "2021-01-04 18:28:18.524133+00",
      username: "al@test.com",
      programType: "combo",
    },
    AL2020: {
      status: "certified",
      year: 2020,
      stateCode: "AL",
      lastChanged: "Mon Jun 27 2022 14:43:08 GMT-0400 (Eastern Daylight Time)",
      username: "Frank States",
      programType: "combo",
    },
  },
  save: {
    error: false,
    saving: false,
  },
};

export const adminUserWithReportInProgress = {
  stateUser: {
    name: null,
    abbr: null,
    imageURI: null,
    currentUser: {
      username: "adminuser@test.com",
      state: {},
      role: AppRoles.CMS_ADMIN,
      lastname: "Admins",
      firstname: "Adam",
      email: "adminuser@test.com",
    },
    localLogin: false,
  },
  global: {
    formName: "CARTS FY",
    largeTextBoxHeight: 6,
    isFetching: false,
    url: "/",
    queryParams: "",
    currentYear: 2021,
    formYear: 2021,
    stateName: "Alabama",
  },
  reportStatus: {
    AL2021: {
      status: "in_progress",
      year: 2021,
      stateCode: "AL",
      lastChanged: "2021-01-04 18:28:18.524133+00",
      username: "al@test.com",
      programType: "combo",
    },
  },
  save: {
    error: false,
    saving: false,
  },
};

export const adminUserWithMultipleReports = {
  formData: [],
  save: {
    error: false,
    errorMessage: null,
    lastSave: null,
    saving: false,
  },
  stateUser: {
    name: null,
    abbr: null,
    imageURI: null,
    currentUser: {
      username: "adminuser@test.com",
      state: {},
      role: "HELP_DESK",
      lastname: "Admins",
      firstname: "Adam",
      email: "adminuser@test.com",
    },
    localLogin: false,
  },
  global: {
    formName: "CARTS FY",
    largeTextBoxHeight: 6,
    isFetching: false,
    url: "/",
    queryParams: "",
    currentYear: 2021,
    formYear: 2020,
  },
  allStatesData: [
    {
      name: "Alabama",
      programNames: {},
      programType: "combo",
      code: "AL",
      fmap_set: [],
      acs_set: [],
    },
    {
      name: "Alaska",
      programNames: {},
      programType: "combo",
      code: "AK",
      fmap_set: [],
      acs_set: [],
    },
    {
      name: "California",
      programNames: {},
      programType: "combo",
      code: "CA",
      fmap_set: [],
      acs_set: [],
    },
    {
      name: "Connecticut",
      programNames: {},
      programType: "combo",
      code: "CT",
      fmap_set: [],
      acs_set: [],
    },
    {
      name: "New Jersey",
      programNames: {},
      programType: "combo",
      code: "NJ",
      fmap_set: [],
      acs_set: [],
    },
    {
      name: "Pennsylvania",
      programNames: {},
      programType: "combo",
      code: "PA",
      fmap_set: [],
      acs_set: [],
    },
    {
      name: "Texas",
      programNames: {},
      programType: "combo",
      code: "TX",
      fmap_set: [],
      acs_set: [],
    },
  ],
  reportStatus: {
    AK2021: {
      status: "in_progress",
      year: 2021,
      stateCode: "AK",
      lastChanged: "2021-01-04 18:28:18.524133+00",
      username: "al@test.com",
      programType: "combo",
    },
    AL2021: {
      status: "in_progress",
      year: 2021,
      stateCode: "AL",
      lastChanged: "2021-01-04 18:28:18.524133+00",
      username: "al@test.com",
      programType: "combo",
    },
    AL2020: {
      status: "certified",
      year: 2020,
      stateCode: "AL",
      lastChanged: "Mon Jun 27 2022 14:43:08 GMT-0400 (Eastern Daylight Time)",
      username: "Frank States",
      programType: "combo",
    },
  },
  lastYearFormData: [],
  lastYearTotals: {
    calculatedTotal: false,
  },
};

export const cmsUserWithMultipleReports = {
  formData: [],
  save: {
    error: false,
    errorMessage: null,
    lastSave: null,
    saving: false,
  },
  stateUser: {
    name: null,
    abbr: null,
    imageURI: null,
    currentUser: {
      username: "cms.user@test.com",
      state: {},
      role: "CMS_USER",
      lastname: "Businesser",
      firstname: "Bobby",
      email: "cms.user@test.com",
    },
    localLogin: false,
  },
  global: {
    formName: "CARTS FY",
    largeTextBoxHeight: 6,
    isFetching: false,
    url: "/",
    queryParams: "",
    currentYear: 2021,
    formYear: 2020,
  },
  reportStatus: {
    AK2021: {
      status: "in_progress",
      year: 2021,
      stateCode: "AK",
      lastChanged: "2021-01-04 18:28:18.524133+00",
      username: "al@test.com",
      programType: "combo",
    },
    AL2021: {
      status: "in_progress",
      year: 2021,
      stateCode: "AL",
      lastChanged: "2021-01-04 18:28:18.524133+00",
      username: "al@test.com",
      programType: "combo",
    },
    AL2020: {
      status: "certified",
      year: 2020,
      stateCode: "AL",
      lastChanged: "Mon Jun 27 2022 14:43:08 GMT-0400 (Eastern Daylight Time)",
      username: "Frank States",
      programType: "combo",
    },
  },
  lastYearFormData: [],
  lastYearTotals: {
    calculatedTotal: false,
  },
};

export const helpdeskUserWithMultipleReports = {
  formData: [],
  save: {
    error: false,
    errorMessage: null,
    lastSave: null,
    saving: false,
  },
  stateUser: {
    name: null,
    abbr: null,
    imageURI: null,
    currentUser: {
      username: "help.desk@test.com",
      state: {},
      role: "HELP_DESK",
      lastname: "Harrison",
      firstname: "George",
      email: "help.desk@test.com",
    },
    localLogin: false,
  },
  global: {
    formName: "CARTS FY",
    largeTextBoxHeight: 6,
    isFetching: false,
    url: "/",
    queryParams: "",
    currentYear: 2021,
    formYear: 2020,
  },
  allStatesData: [
    {
      name: "Alabama",
      programNames: {},
      programType: "combo",
      code: "AL",
      fmap_set: [],
      acs_set: [],
    },
    {
      name: "Alaska",
      programNames: {},
      programType: "combo",
      code: "AK",
      fmap_set: [],
      acs_set: [],
    },
    {
      name: "California",
      programNames: {},
      programType: "combo",
      code: "CA",
      fmap_set: [],
      acs_set: [],
    },
    {
      name: "Connecticut",
      programNames: {},
      programType: "combo",
      code: "CT",
      fmap_set: [],
      acs_set: [],
    },
    {
      name: "New Jersey",
      programNames: {},
      programType: "combo",
      code: "NJ",
      fmap_set: [],
      acs_set: [],
    },
    {
      name: "Pennsylvania",
      programNames: {},
      programType: "combo",
      code: "PA",
      fmap_set: [],
      acs_set: [],
    },
    {
      name: "Texas",
      programNames: {},
      programType: "combo",
      code: "TX",
      fmap_set: [],
      acs_set: [],
    },
  ],
  reportStatus: {
    AK2021: {
      status: "in_progress",
      year: 2021,
      stateCode: "AK",
      lastChanged: "2021-01-04 18:28:18.524133+00",
      username: "al@test.com",
      programType: "combo",
    },
    AL2021: {
      status: "in_progress",
      year: 2021,
      stateCode: "AL",
      lastChanged: "2021-01-04 18:28:18.524133+00",
      username: "al@test.com",
      programType: "combo",
    },
    AL2020: {
      status: "certified",
      year: 2020,
      stateCode: "AL",
      lastChanged: "Mon Jun 27 2022 14:43:08 GMT-0400 (Eastern Daylight Time)",
      username: "Frank States",
      programType: "combo",
    },
  },
  lastYearFormData: [],
  lastYearTotals: {
    calculatedTotal: false,
  },
};
