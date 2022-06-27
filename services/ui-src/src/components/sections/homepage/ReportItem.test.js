import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter } from "react-router";
import { axe } from "jest-axe";
import configureMockStore from "redux-mock-store";
import ReportItem from "./ReportItem";
import { Provider } from "react-redux";
import {
  stateUserWithReportCertified,
  stateUserWithReportInProgress,
} from "../../../store/fakeStoreExamples";

const mockStore = configureMockStore();

// const cmsUser = mockStore(cmsUserWithReportInProgress);
const CMSHomepageCMSUserAl2020Props = {
  link1URL: "/views/sections/AL/2020/00/a",
  name: "Alabama",
  year: 2020,
  statusText: "In Progress",
  userRole: "CMS_USER",
  username: "al@test.com",
  lastChanged: "Mon Jun 27 2022 12:24:11 GMT-0400 (Eastern Daylight Time)",
};

// const adminUser = mockStore(cmsUserWithReportInProgress);
const CMSHomepageAdminUserProps = {
  link1URL: "/views/sections/AL/2020/00/a",
  name: "Alabama",
  year: 2020,
  statusText: "In Progress",
  userRole: "HELP_DESK",
  username: "al@test.com",
  lastChanged: "Mon Jun 27 2022 12:24:11 GMT-0400 (Eastern Daylight Time)",
};

// const helpdeskUser = mockStore(helpDeskUserWithReportInProgress);
const CMSHomepageHelpDeskUserProps = {
  link1URL: "/views/sections/AL/2020/00/a",
  name: "Alabama",
  year: 2020,
  statusText: "Not Started",
  userRole: "HELP_DESK",
  username: "al@test.com",
  lastChanged: "Mon Jun 27 2022 12:24:11 GMT-0400 (Eastern Daylight Time)",
};

// As of 2022-06-27, only State users can access the homepage view
const stateUserProg = mockStore(stateUserWithReportInProgress);
const HomepageStateUserInProgProps = {
  name: 2021,
  lastChanged: "2021-01-04 18:28:18.524133+00",
  link1URL: "/sections/2021/00",
  link1Text: "Edit",
  statusText: "In Progress",
  userRole: "STATE_USER",
  year: 2021,
};

const stateUserCert = mockStore(stateUserWithReportCertified);
const HomepageStateUserCertProps = {
  name: 2021,
  lastChanged: "2021-01-04 18:28:18.524133+00",
  link1URL: "/sections/2021/00",
  link1Text: "Edit",
  statusText: "In Progress",
  userRole: "STATE_USER",
  year: 2021,
};

describe("ReportItem viewed by a CMS User", () => {
  const cmsUserAl2020wrapper = (
    <Provider>
      <ReportItem {...CMSHomepageCMSUserAl2020Props} />
    </Provider>
  );

  it("should render AL2020 correctly", () => {
    expect(shallow(cmsUserAl2020wrapper).exists()).toBe(true);
  });
});

describe("ReportItem viewed by a Admin User", () => {
  const adminUserWrapper = <ReportItem {...CMSHomepageAdminUserProps} />;

  it("should render correctly", () => {
    expect(shallow(adminUserWrapper).exists()).toBe(true);
  });
});

describe("ReportItem viewed by a Help Desk User", () => {
  const helpdeskUserWrapper = <ReportItem {...CMSHomepageHelpDeskUserProps} />;

  it("should render correctly", () => {
    expect(shallow(helpdeskUserWrapper).exists()).toBe(true);
  });
});

describe("ReportItem viewed by a State User", () => {
  const stateUserInProgWrapper = (
    <Provider store={stateUserProg}>
      <ReportItem {...HomepageStateUserInProgProps} />
    </Provider>
  );

  const stateUserCertWrapper = (
    <Provider store={stateUserCert}>
      <ReportItem {...HomepageStateUserCertProps} />
    </Provider>
  );

  it("should render In Progress correctly", () => {
    expect(shallow(stateUserInProgWrapper).exists()).toBe(true);
  });

  it("should render Certified correctly", () => {
    expect(shallow(stateUserCertWrapper).exists()).toBe(true);
  });
});

describe("Test <ActionCard /> accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const stateUserInProgWrapper = (
      <Provider store={stateUserProg}>
        <MemoryRouter initialEntries={["/"]}>
          <ReportItem {...HomepageStateUserInProgProps} />
        </MemoryRouter>
      </Provider>
    );
    const stateResults = await axe(mount(stateUserInProgWrapper).html());
    expect(stateResults).toHaveNoViolations();
  });
});
