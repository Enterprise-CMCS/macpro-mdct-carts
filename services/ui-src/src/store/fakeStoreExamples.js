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
