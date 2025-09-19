import React from "react";
import { MemoryRouter } from "../../../util/testing/mockRouter";
import { screen, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";
import { useDispatch, Provider } from "react-redux";
import { axe } from "jest-axe";
// components
import ReportItemLinks from "./ReportItemLinks";
// mocks
import {
  adminUserWithMultipleReports,
  approverUserWithMultipleReports,
  cmsUserWithMultipleReports,
  helpdeskUserWithMultipleReports,
  stateUserWithMultipleReports,
} from "../../../store/fakeStoreExamples";
// utils
import { uncertifyReport } from "../../../actions/uncertify";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

jest.mock("../../../actions/uncertify", () => ({
  uncertifyReport: jest.fn(),
}));

const mockStore = configureMockStore();

/**
 *********************
 * State User (stateuser2@test.com)
 *********************
 */

// As of 2022-06-27, only State users can access the homepage view
const stateUser = mockStore(stateUserWithMultipleReports);
const HomepageStateUserInProgProps = {
  actionLinkURL: "/sections/2021/00",
  actionLinkText: "Edit",
  stateCode: "AL",
  status: "in_progress",
  timeZone: "America/New_York",
  userRole: "STATE_USER",
  year: 2021,
};

const HomepageStateUserCertProps = {
  actionLinkURL: "/sections/2020/00",
  actionLinkText: "View",
  stateCode: "AL",
  status: "certified",
  timeZone: "America/New_York",
  userRole: "STATE_USER",
  year: 2020,
};

describe("<ReportItemLinks />", () => {
  describe("ReportItemLinks viewed by a State User", () => {
    beforeAll(() => {
      window.scrollTo = jest.fn();
    });

    const stateUserInProgWrapper = (
      <Provider store={stateUser}>
        <MemoryRouter initialEntries={["/"]}>
          <ReportItemLinks {...HomepageStateUserInProgProps} />
        </MemoryRouter>
      </Provider>
    );

    const stateUserCertWrapper = (
      <Provider store={stateUser}>
        <MemoryRouter initialEntries={["/"]}>
          <ReportItemLinks {...HomepageStateUserCertProps} />
        </MemoryRouter>
      </Provider>
    );

    test("should render an In_Progress report with passed props", () => {
      render(stateUserInProgWrapper);
      expect(
        screen.getByRole("link", { name: "Edit AL 2021 report" })
      ).toBeVisible();
      expect(
        screen.getByRole("link", { name: "Print AL 2021 report" })
      ).toBeVisible();
    });

    test("should render other reports statuses and time stamps properly", () => {
      render(stateUserCertWrapper);
      expect(
        screen.getByRole("link", { name: "View AL 2020 report" })
      ).toBeVisible();
      expect(
        screen.getByRole("link", { name: "Print AL 2020 report" })
      ).toBeVisible();
    });

    test("In_Progress report items should not have basic accessibility issues", async () => {
      const { container } = render(stateUserInProgWrapper);
      const stateInProgResults = await axe(container);
      expect(stateInProgResults).toHaveNoViolations();
    });

    test("Certified report items  should not have basic accessibility issues", async () => {
      const { container } = render(stateUserCertWrapper);
      const stateCertResults = await axe(container);
      expect(stateCertResults).toHaveNoViolations();
    });
  });

  /**
   *********************
   * CMS User (cms.user@test.com)
   *********************
   */

  const cmsUser = mockStore(cmsUserWithMultipleReports);
  const CMSHomepageCMSUserAL2020Props = {
    actionLinkURL: "/views/sections/AL/2020/00/a",
    stateCode: "AL",
    status: "certified",
    timeZone: "America/New_York",
    userRole: "CMS_USER",
    year: 2020,
  };

  const CMSHomepageCMSUserAL2021Props = {
    actionLinkURL: "/views/sections/AL/2021/00/a",
    stateCode: "AL",
    status: "in_progress",
    timeZone: "America/New_York",
    userRole: "CMS_USER",
    year: 2021,
  };

  describe("ReportItemLinks viewed by a CMS User", () => {
    const cmsUserInProgWrapper = (
      <Provider store={cmsUser}>
        <MemoryRouter initialEntries={["/"]}>
          <ReportItemLinks {...CMSHomepageCMSUserAL2021Props} />
        </MemoryRouter>
      </Provider>
    );

    const cmsUserCertWrapper = (
      <Provider store={cmsUser}>
        <MemoryRouter initialEntries={["/"]}>
          <ReportItemLinks {...CMSHomepageCMSUserAL2020Props} />
        </MemoryRouter>
      </Provider>
    );

    test("should render an In_Progress report with passed props", () => {
      render(cmsUserInProgWrapper);
      expect(
        screen.getByRole("link", { name: "View AL 2021 report" })
      ).toBeVisible();
      expect(
        screen.getByRole("link", { name: "Print AL 2021 report" })
      ).toBeVisible();
    });

    test("should render other reports statuses and time stamps properly", () => {
      render(cmsUserCertWrapper);
      expect(
        screen.getByRole("link", { name: "View AL 2020 report" })
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: "Uncertify AL 2020 report" })
      ).toBeVisible();
    });

    test("should handle uncertify being clicked and show new modal", async () => {
      useDispatch.mockReturnValue(jest.fn());
      render(cmsUserCertWrapper);
      const uncertifyButton = screen.getByRole("button", {
        name: "Uncertify AL 2020 report",
      });
      await userEvent.click(uncertifyButton);

      const uncertifyModal = screen.getByRole("dialog");
      const modalUncertifyButton = within(uncertifyModal).getByRole("button", {
        name: "Uncertify AL 2020 report",
      });
      await userEvent.click(modalUncertifyButton);
      expect(uncertifyReport).toHaveBeenCalledWith("AL", 2020);
    });

    test("In_Progress report items should not have basic accessibility issues", async () => {
      const { container } = render(cmsUserCertWrapper);
      const stateInProgResults = await axe(container);
      expect(stateInProgResults).toHaveNoViolations();
    });

    test("Certified report items  should not have basic accessibility issues", async () => {
      const { container } = render(cmsUserCertWrapper);
      const stateCertResults = await axe(container);
      expect(stateCertResults).toHaveNoViolations();
    });
  });

  /**
   *********************
   * Admin User (adminuser@test.com)
   *********************
   */

  const adminUser = mockStore(adminUserWithMultipleReports);
  const CMSHomepageAdminAL2020Props = {
    actionLinkURL: "/views/sections/AL/2020/00/a",
    stateCode: "AL",
    status: "certified",
    timeZone: "America/New_York",
    userRole: "CMS_ADMIN",
    year: 2020,
  };

  const CMSHomepageAdminAL2021Props = {
    actionLinkURL: "/views/sections/AL/2021/00/a",
    stateCode: "AL",
    status: "in_progress",
    timeZone: "America/New_York",
    userRole: "CMS_ADMIN",
    year: 2021,
  };

  describe("ReportItemLinks viewed by an Admin User", () => {
    const adminUserInProgWrapper = (
      <Provider store={adminUser}>
        <MemoryRouter initialEntries={["/"]}>
          <ReportItemLinks {...CMSHomepageAdminAL2021Props} />
        </MemoryRouter>
      </Provider>
    );

    const adminUserCertWrapper = (
      <Provider store={adminUser}>
        <MemoryRouter initialEntries={["/"]}>
          <ReportItemLinks {...CMSHomepageAdminAL2020Props} />
        </MemoryRouter>
      </Provider>
    );

    test("should render an In_Progress report with passed props", () => {
      render(adminUserInProgWrapper);
      expect(
        screen.getByRole("link", { name: "View AL 2021 report" })
      ).toBeVisible();
      expect(
        screen.getByRole("link", { name: "Print AL 2021 report" })
      ).toBeVisible();
    });

    test("should render other reports statuses and time stamps properly", () => {
      render(adminUserCertWrapper);
      expect(
        screen.getByRole("link", { name: "View AL 2020 report" })
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: "Uncertify AL 2020 report" })
      ).toBeVisible();
    });

    test("In_Progress report items should not have basic accessibility issues", async () => {
      const { container } = render(adminUserInProgWrapper);
      const stateInProgResults = await axe(container);
      expect(stateInProgResults).toHaveNoViolations();
    });

    test("Certified report items  should not have basic accessibility issues", async () => {
      const { container } = render(adminUserCertWrapper);
      const stateCertResults = await axe(container);
      expect(stateCertResults).toHaveNoViolations();
    });
  });

  /**
   *********************
   * Help Desk User (help.desk@test.com)
   *********************
   */

  const helpdeskUser = mockStore(helpdeskUserWithMultipleReports);
  const CMSHomepageHelpdeskAl2020Props = {
    actionLinkURL: "/views/sections/AL/2020/00/a",
    stateCode: "AL",
    status: "certified",
    timeZone: "America/New_York",
    userRole: "HELP_DESK",
    year: 2020,
  };

  const CMSHomepageHelpdeskAL2021Props = {
    actionLinkURL: "/views/sections/AL/2021/00/a",
    stateCode: "AL",
    status: "in_progress",
    timeZone: "America/New_York",
    userRole: "HELP_DESK",
    year: 2021,
  };

  describe("ReportItemLinks viewed by an Help Desk User", () => {
    const helpdeskUserInProgWrapper = (
      <Provider store={helpdeskUser}>
        <MemoryRouter initialEntries={["/"]}>
          <ReportItemLinks {...CMSHomepageHelpdeskAL2021Props} />
        </MemoryRouter>
      </Provider>
    );

    const helpdeskUserCertWrapper = (
      <Provider store={helpdeskUser}>
        <MemoryRouter initialEntries={["/"]}>
          <ReportItemLinks {...CMSHomepageHelpdeskAl2020Props} />
        </MemoryRouter>
      </Provider>
    );

    test("should render an In_Progress report with passed props", () => {
      render(helpdeskUserInProgWrapper);
      expect(
        screen.getByRole("link", { name: "View AL 2021 report" })
      ).toBeVisible();
      expect(
        screen.getByRole("link", { name: "Print AL 2021 report" })
      ).toBeVisible();
    });

    test("should render other reports statuses and time stamps properly", () => {
      render(helpdeskUserCertWrapper);
      expect(
        screen.getByRole("link", { name: "View AL 2020 report" })
      ).toBeVisible();
      expect(
        screen.getByRole("link", { name: "Print AL 2020 report" })
      ).toBeVisible();
      expect(
        screen.queryByRole("button", { name: /Uncertify/ })
      ).not.toBeInTheDocument();
    });

    test("In_Progress report items should not have basic accessibility issues", async () => {
      const { container } = render(helpdeskUserInProgWrapper);
      const stateInProgResults = await axe(container);
      expect(stateInProgResults).toHaveNoViolations();
    });

    test("Certified report items  should not have basic accessibility issues", async () => {
      const { container } = render(helpdeskUserCertWrapper);
      const stateCertResults = await axe(container);
      expect(stateCertResults).toHaveNoViolations();
    });
  });

  /**
   *********************
   * Approver User (help.approver@test.com)
   *********************
   */

  const approverUser = mockStore(approverUserWithMultipleReports);
  const CMSHomepageApproverAL2020Props = {
    actionLinkURL: "/views/sections/AL/2020/00/a",
    stateCode: "AL",
    status: "certified",
    timeZone: "America/New_York",
    userRole: "CMS_APPROVER",
    year: 2020,
  };

  const CMSHomepageApproverAL2021Props = {
    actionLinkURL: "/views/sections/AL/2021/00/a",
    stateCode: "AL",
    status: "in_progress",
    timeZone: "America/New_York",
    userRole: "CMS_APPROVER",
    year: 2021,
  };

  describe("ReportItemLinks viewed by an Admin User", () => {
    const approverUserInProgWrapper = (
      <Provider store={approverUser}>
        <MemoryRouter initialEntries={["/"]}>
          <ReportItemLinks {...CMSHomepageApproverAL2021Props} />
        </MemoryRouter>
      </Provider>
    );

    const approverUserCertWrapper = (
      <Provider store={approverUser}>
        <MemoryRouter initialEntries={["/"]}>
          <ReportItemLinks {...CMSHomepageApproverAL2020Props} />
        </MemoryRouter>
      </Provider>
    );

    test("should render an In_Progress report with passed props", () => {
      render(approverUserInProgWrapper);
      expect(
        screen.getByRole("link", { name: "View AL 2021 report" })
      ).toBeVisible();
      expect(
        screen.getByRole("link", { name: "Print AL 2021 report" })
      ).toBeVisible();
    });

    test("should render other reports statuses and time stamps properly", () => {
      render(approverUserCertWrapper);
      expect(
        screen.getByRole("link", { name: "View AL 2020 report" })
      ).toBeVisible();
      expect(
        screen.getByRole("link", { name: "Print AL 2020 report" })
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: "Uncertify AL 2020 report" })
      ).toBeVisible();
    });

    test("In_Progress report items should not have basic accessibility issues", async () => {
      const { container } = render(approverUserCertWrapper);
      const stateInProgResults = await axe(container);
      expect(stateInProgResults).toHaveNoViolations();
    });

    test("Certified report items  should not have basic accessibility issues", async () => {
      const { container } = render(approverUserCertWrapper);
      const stateCertResults = await axe(container);
      expect(stateCertResults).toHaveNoViolations();
    });
  });
});
