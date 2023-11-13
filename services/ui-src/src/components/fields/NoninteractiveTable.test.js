import React from "react";
import { render, screen } from "@testing-library/react";
import NoninteractiveTable from "./NoninteractiveTable";

describe("Non-interactive Table", () => {
  test("should render data in a proper table structure", () => {
    const props = {
      tableTitle: "Mock Table Title",
      question: {
        fieldset_info: {
          headers: ["Header1", "Header2"],
          rows: [
            ["lorem", "ipsum"],
            ["dolor", "sit"],
          ],
        },
      },
    };
    const { container } = render(<NoninteractiveTable {...props} />);

    const table = container.querySelector("table");
    expect(table).toHaveAttribute("summary", "Mock Table Title");

    const columnHeaders = container.querySelectorAll("table > thead > tr > th");
    expect(columnHeaders[0]).toHaveTextContent("Header1");
    expect(columnHeaders[1]).toHaveTextContent("Header2");

    const rowHeaders = container.querySelectorAll(
      "table > tbody > tr > th:first-child"
    );
    expect(rowHeaders[0]).toHaveTextContent("lorem");
    expect(rowHeaders[1]).toHaveTextContent("dolor");

    const rowData = container.querySelectorAll(
      "table > tbody > tr > td:last-child"
    );
    expect(rowData[0]).toHaveTextContent("ipsum");
    expect(rowData[1]).toHaveTextContent("sit");
  });

  test("should render percentages nicely", () => {
    const props = {
      tableTitle: "Mock Table Title",
      question: {
        fieldset_info: {
          headers: ["Foo Percent", "Percent of Bar"],
          rows: [[5678, 0.111]],
        },
      },
    };
    render(<NoninteractiveTable {...props} />);

    expect(screen.getByText("5,678%")).toBeInTheDocument();
    expect(screen.getByText("0.111%")).toBeInTheDocument();
  });

  test("should contain special logic for CHIP enrollment", () => {
    const props = {
      tableTitle: "Mock Table Title",
      question: {
        fieldset_info: {
          headers: [
            "Program",
            "Number of children enrolled in FFY X",
            "Number of children enrolled in FFY Y",
            "Percent change from year X",
          ],
          rows: [
            ["Medicaid Expansion CHIP", 1000, 1100, "mock placeholder"],
            ["Separate CHIP", 0, 1100, "mock placeholder"],
          ],
        },
      },
    };
    render(<NoninteractiveTable {...props} />);

    // The 4th column's value is replaced by calculation results
    expect(
      screen.queryByText("mock placeholder", { exact: false })
    ).not.toBeInTheDocument();

    // From 1000 -> 1100 is +10%
    expect(screen.getByText("10%")).toBeInTheDocument();

    // From 0 -> 1100 is not expressible as a percent
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
