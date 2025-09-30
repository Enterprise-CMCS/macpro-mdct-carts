import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { MemoryRouter } from "../../../util/testing/mockRouter";
// components
import Homepage from "./Homepage";
// mocks
import { stateUserWithMultipleReports } from "../../../store/fakeStoreExamples";

jest.mock("./TemplateDownload", () => {
  return jest.fn(({ getTemplate }) => {
    global.mockedGetTemplate = getTemplate;
    return <button onClick={() => getTemplate(2020)}>Download template</button>;
  });
});

const mockStore = configureMockStore();
const stateUser = mockStore(stateUserWithMultipleReports);

const HomepageComponent = (
  <Provider store={stateUser}>
    <MemoryRouter path={[]}>
      <Homepage />
    </MemoryRouter>
  </Provider>
);

describe("<Homepage />", () => {
  test("renders", async () => {
    render(HomepageComponent);
    await userEvent.click(
      screen.getByRole("button", { name: "Download template" })
    );
    expect(screen.getAllByRole("row").length).toBe(3);
    expect(screen.getByRole("cell", { name: "In Progress" })).toBeVisible();
    expect(
      screen.getByRole("cell", { name: "Certified and Submitted" })
    ).toBeVisible(1);
  });
});
