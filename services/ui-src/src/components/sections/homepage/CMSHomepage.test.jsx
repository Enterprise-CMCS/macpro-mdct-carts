import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { MemoryRouter } from "../../../util/testing/mockRouter";
// components
import CMSHomepage from "./CMSHomepage";
// mocks
import { helpdeskUserWithMultipleReports } from "../../../store/fakeStoreExamples";

const mockStore = configureMockStore([thunk]);
const adminUser = mockStore(helpdeskUserWithMultipleReports);

jest.mock("../../../actions/initial", () => ({
  getAllStateStatuses: jest.fn().mockReturnValue(() => async () => {}),
}));

const CmsHomepageComponent = (
  <Provider store={adminUser}>
    <MemoryRouter path={[]}>
      <CMSHomepage />
    </MemoryRouter>
  </Provider>
);

describe("<CMSHomepage />", () => {
  test("renders all rows", () => {
    render(CmsHomepageComponent);
    expect(screen.getAllByRole("cell", { name: "State: Alabama" }).length).toBe(
      2
    );
    expect(screen.getAllByRole("cell", { name: "State: Alaska" }).length).toBe(
      1
    );
    expect(
      screen.getAllByRole("cell", { name: "Status: Certified and Submitted" })
        .length
    ).toBe(1);
  });

  test("can be filtered by state", async () => {
    render(CmsHomepageComponent);
    expect(screen.getAllByRole("row").length).toBe(4);
    expect(screen.getAllByRole("cell", { name: "State: Alabama" }).length).toBe(
      2
    );
    expect(screen.getAllByRole("cell", { name: "State: Alaska" }).length).toBe(
      1
    );
    expect(
      screen.queryByRole("cell", { name: "California" })
    ).not.toBeInTheDocument();

    const stateFilterDropdown = screen.getByText("State", {
      selector: "span",
    });
    await userEvent.click(stateFilterDropdown);

    const filterContainer = document.querySelector("div.filter-container");
    const alabamaDropdownOption = within(filterContainer).queryByText(
      "Alabama",
      {
        selector: "span",
      }
    );
    await userEvent.click(alabamaDropdownOption);
    await userEvent.click(screen.getByText("Filter", { selector: "button" }));

    expect(screen.getAllByRole("row").length).toBe(3);
    expect(screen.getAllByRole("cell", { name: "State: Alabama" }).length).toBe(
      2
    );
    expect(
      screen.queryByRole("cell", { name: "State: Alaska" })
    ).not.toBeInTheDocument();
  });

  test("can be filtered by year", async () => {
    render(CmsHomepageComponent);
    expect(screen.getAllByRole("row").length).toBe(4);
    expect(screen.getAllByRole("cell", { name: "Year: 2021" }).length).toBe(2);
    expect(screen.getAllByRole("cell", { name: "Year: 2020" }).length).toBe(1);

    let filterContainer = document.querySelector("div.filter-container");
    const yearFilterDropdown = within(filterContainer).getByText("Year", {
      selector: "span",
    });
    await userEvent.click(yearFilterDropdown);

    filterContainer = document.querySelector("div.filter-container");
    const year2021DropdownOption = within(filterContainer).queryByText("2021", {
      selector: "span",
    });
    await userEvent.click(year2021DropdownOption);
    await userEvent.click(screen.getByText("Filter", { selector: "button" }));

    expect(screen.getAllByRole("row").length).toBe(3);
    expect(screen.getAllByRole("cell", { name: "Year: 2021" }).length).toBe(2);
    expect(
      screen.queryByRole("cell", { name: "Year: 2020" })
    ).not.toBeInTheDocument();
  });

  test("can be filtered by status", async () => {
    render(CmsHomepageComponent);
    expect(screen.getAllByRole("row").length).toBe(4);
    expect(screen.queryByText("Not Started")).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("cell", { name: "Status: In Progress" }).length
    ).toBe(2);

    const filterContainer = document.querySelector("div.filter-container");
    const yearFilterDropdown = within(filterContainer).getByText("Status", {
      selector: "span",
    });
    await userEvent.click(yearFilterDropdown);
    await userEvent.click(screen.queryByText("Not Started"));
    await userEvent.click(screen.getByText("Filter", { selector: "button" }));

    expect(screen.getAllByRole("row").length).toBe(1);
    expect(
      screen.queryByRole("cell", { name: "Status: In Progress" })
    ).not.toBeInTheDocument();
  });

  test("can clear filters", async () => {
    render(CmsHomepageComponent);
    expect(screen.getAllByRole("row").length).toBe(4);
    expect(
      screen.getAllByRole("cell", { name: "Status: In Progress" }).length
    ).toBe(2);
    expect(
      screen.queryByRole("cell", { name: "Not Started" })
    ).not.toBeInTheDocument();

    const filterContainer = document.querySelector("div.filter-container");
    const yearFilterDropdown = within(filterContainer).getByText("Status", {
      selector: "span",
    });
    await userEvent.click(yearFilterDropdown);
    await userEvent.click(screen.queryByText("Not Started"));
    await userEvent.click(screen.getByText("Filter", { selector: "button" }));

    expect(screen.getAllByRole("row").length).toBe(1);
    expect(
      screen.queryByRole("cell", { name: "Status: In Progress" })
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Clear", { selector: "button" }));

    expect(screen.getAllByRole("row").length).toBe(4);
    expect(
      screen.getAllByRole("cell", { name: "Status: In Progress" }).length
    ).toBe(2);
    expect(
      screen.queryByRole("cell", { name: "Status: Not Started" })
    ).not.toBeInTheDocument();
  });
});
