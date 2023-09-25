import React from "react";
import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import UploadComponent from "./UploadComponent";
import { AppRoles, REPORT_STATUS } from "../../types";

jest.mock("aws-amplify", () => ({
  API: {
    post: () => jest.fn(),
  },
  Auth: {
    currentSession: jest.fn().mockReturnValue({
      getIdToken: () => ({
        getJwtToken: jest.fn(),
      }),
    }),
  },
}));
jest.mock("../../hooks/authHooks");
jest.mock("../../util/apiLib", () => ({
  apiLib: {
    post: jest.fn().mockReturnValue({
      catch: jest.fn(),
    }),
  },
}));

const mockStore = configureMockStore();
const store = mockStore({
  stateUser: {
    currentUser: AppRoles.STATE_USER,
    abbr: "AL",
  },
  formData: [
    {
      contents: {
        section: {
          year: "2023",
          state: "AL",
        },
      },
    },
  ],
  reportStatus: {
    AL2023: {
      status: REPORT_STATUS.in_progress,
    },
  },
});

const mockProps = {
  question: {
    id: "mock-question-1",
  },
};

const TestUploadComponent = (
  <Provider store={store}>
    <UploadComponent {...mockProps} />
  </Provider>
);

describe("test UploadComponent", () => {
  test("upload component renders", () => {
    render(TestUploadComponent);
    const uploadField = screen.getByLabelText(
      "Click Choose Files and make your selection(s)",
      { exact: false }
    );
    const uploadButtonText = screen.getByText("Upload");
    expect(uploadField).toBeInTheDocument();
    expect(uploadButtonText).toBeInTheDocument();
  });
});
