import React from "react";
import { act, render, screen, within } from "@testing-library/react";
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
    expect(screen.getAllByRole("cell", { name: "Alabama" }).length).toBe(2);
    expect(screen.getAllByRole("cell", { name: "Alaska" }).length).toBe(1);
    expect(
      screen.getAllByRole("cell", { name: "Certified and Submitted" }).length
    ).toBe(1);
  });

  test("can be filtered by state", async () => {
    const user = userEvent.setup();
    render(CmsHomepageComponent);
    expect(screen.getAllByRole("row").length).toBe(4);
    expect(screen.getAllByRole("cell", { name: "Alabama" }).length).toBe(2);
    expect(screen.getAllByRole("cell", { name: "Alaska" }).length).toBe(1);
    expect(
      screen.queryByRole("cell", { name: "California" })
    ).not.toBeInTheDocument();

    const stateFilterDropdown = screen.getByText("State", {
      selector: "span",
    });
    await user.click(stateFilterDropdown);

    const filterContainer = document.querySelector("div.filter-container");
    const alabamaDropdownOption = within(filterContainer).queryByText(
      "Alabama",
      {
        selector: "span",
      }
    );

    // Wait for SortableTable to update
    await act(async () => {
      await user.click(alabamaDropdownOption);
      await user.click(screen.getByText("Filter", { selector: "button" }));
    });
    expect(screen.getAllByRole("row").length).toBe(3);
    expect(screen.getAllByRole("cell", { name: "Alabama" }).length).toBe(2);
    expect(
      screen.queryByRole("cell", { name: "Alaska" })
    ).not.toBeInTheDocument();
  });

  test("can be filtered by year", async () => {
    const user = userEvent.setup();
    render(CmsHomepageComponent);
    expect(screen.getAllByRole("row").length).toBe(4);
    expect(screen.getAllByRole("cell", { name: "2021" }).length).toBe(2);
    expect(screen.getAllByRole("cell", { name: "2020" }).length).toBe(1);

    let filterContainer = document.querySelector("div.filter-container");
    const yearFilterDropdown = within(filterContainer).getByText("Year", {
      selector: "span",
    });
    await user.click(yearFilterDropdown);

    filterContainer = document.querySelector("div.filter-container");
    const year2021DropdownOption = within(filterContainer).queryByText("2021", {
      selector: "span",
    });

    // Wait for SortableTable to update
    await act(async () => {
      await user.click(year2021DropdownOption);
      await user.click(screen.getByText("Filter", { selector: "button" }));
    });
    expect(screen.getAllByRole("row").length).toBe(3);
    expect(screen.getAllByRole("cell", { name: "2021" }).length).toBe(2);
    expect(
      screen.queryByRole("cell", { name: "2020" })
    ).not.toBeInTheDocument();
  });

  test("can be filtered by status", async () => {
    const user = userEvent.setup();
    render(CmsHomepageComponent);
    expect(screen.getAllByRole("row").length).toBe(4);
    expect(screen.queryByText("Not Started")).not.toBeInTheDocument();
    expect(screen.getAllByRole("cell", { name: "In Progress" }).length).toBe(2);

    const filterContainer = document.querySelector("div.filter-container");
    const yearFilterDropdown = within(filterContainer).getByText("Status", {
      selector: "span",
    });
    // Wait for SortableTable to update
    await act(async () => {
      await user.click(yearFilterDropdown);
      await user.click(screen.queryByText("Not Started"));
      await user.click(screen.getByText("Filter", { selector: "button" }));
    });
    expect(screen.getAllByRole("row").length).toBe(1);
    expect(
      screen.queryByRole("cell", { name: "In Progress" })
    ).not.toBeInTheDocument();
  });

  test("can clear filters", async () => {
    const user = userEvent.setup();
    render(CmsHomepageComponent);
    expect(screen.getAllByRole("row").length).toBe(4);
    expect(screen.getAllByRole("cell", { name: "In Progress" }).length).toBe(2);
    expect(
      screen.queryByRole("cell", { name: "Not Started" })
    ).not.toBeInTheDocument();

    const filterContainer = document.querySelector("div.filter-container");
    const yearFilterDropdown = within(filterContainer).getByText("Status", {
      selector: "span",
    });
    // Wait for SortableTable to update
    await act(async () => {
      await user.click(yearFilterDropdown);
      await user.click(screen.queryByText("Not Started"));
      await user.click(screen.getByText("Filter", { selector: "button" }));
    });
    expect(screen.getAllByRole("row").length).toBe(1);
    expect(
      screen.queryByRole("cell", { name: "In Progress" })
    ).not.toBeInTheDocument();

    // Wait for SortableTable to update
    await act(async () => {
      await user.click(screen.getByText("Clear", { selector: "button" }));
    });
    expect(screen.getAllByRole("row").length).toBe(4);
    expect(screen.getAllByRole("cell", { name: "In Progress" }).length).toBe(2);
    expect(
      screen.queryByRole("cell", { name: "Not Started" })
    ).not.toBeInTheDocument();
  });
});
