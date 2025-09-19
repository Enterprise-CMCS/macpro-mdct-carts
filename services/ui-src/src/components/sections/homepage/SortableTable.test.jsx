import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import SortableTable, { generateColumns } from "./SortableTable";

const content = {
  sortableHeadRow: {
    id: { header: "ID" },
    name: { header: "Name" },
    actions: { header: "Actions", hidden: true },
  },
};

function customCells(headerKey, value) {
  return `Custom ${headerKey}: ${value}`;
}

const columns = generateColumns(content.sortableHeadRow, true);
const customColumns = generateColumns(
  content.sortableHeadRow,
  true,
  customCells
);

const data = [
  {
    id: "a",
    name: "Test Name",
  },
  {
    id: "b",
    name: "",
  },
];

const sortableTableComponent = <SortableTable columns={columns} data={data} />;

const sortableTableCustomComponent = (
  <SortableTable
    columns={customColumns}
    data={data}
    initialSorting={[{ id: "id", desc: true }]}
  />
);

describe("<SortableTable />", () => {
  test("sort ascending", async () => {
    const { container } = render(sortableTableComponent);
    expect(screen.getByRole("table")).toBeVisible();

    // Click once to sort ascending
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "ID" }));
    });

    const cells = container.querySelectorAll("td");
    const columnHeader = screen.getByRole("columnheader", { name: "ID" });
    expect(cells.length).toBe(6);
    expect(cells[0]).toHaveTextContent(data[0].id);
    expect(columnHeader).toHaveAttribute("aria-sort", "ascending");
  });

  test("sort descending", async () => {
    const { container } = render(sortableTableComponent);

    // Click twice to sort descending
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "ID" }));
      await userEvent.click(screen.getByRole("button", { name: "ID" }));
    });

    const cells = container.querySelectorAll("td");
    const columnHeader = screen.getByRole("columnheader", { name: "ID" });
    expect(cells.length).toBe(6);
    expect(cells[0]).toHaveTextContent(data[1].id);
    expect(columnHeader).toHaveAttribute("aria-sort", "descending");
  });

  test("with initialSorting", () => {
    const { container } = render(sortableTableCustomComponent);

    const cells = container.querySelectorAll("td");
    const columnHeader = screen.getByRole("columnheader", { name: "ID" });
    expect(cells.length).toBe(6);
    expect(cells[0]).toHaveTextContent(`Custom id: ${data[1].id}`);
    expect(columnHeader).toHaveAttribute("aria-sort", "descending");
  });

  test("visually hidden head row", () => {
    render(sortableTableCustomComponent);

    const columnHeader = screen.getByRole("columnheader", { name: "Actions" });
    const innerSpan = columnHeader.querySelector("span.sortable-hidden");
    expect(innerSpan).toHaveTextContent("Actions");
  });

  describe("generateColumns()", () => {
    const sortableHeadRow = {
      id: { header: "ID", admin: true, filter: false },
      name: { header: "Name", stateUser: true, sort: false },
      actions: { header: "Actions", hidden: true },
    };

    test("create columns for admin", () => {
      const columns = generateColumns(sortableHeadRow, true);
      expect(columns.length).toBe(2);

      expect(columns[0].id).toBe("id");
      expect(columns[0].enableColumnFilter).toBe(false);
      expect(columns[0].enableSorting).toBe(true);

      expect(columns[1].id).toBe("actions");
      expect(columns[1].enableColumnFilter).toBe(false);
      expect(columns[1].enableSorting).toBe(false);
    });

    test("create columns for state user", () => {
      const columns = generateColumns(sortableHeadRow, false);
      expect(columns.length).toBe(2);

      expect(columns[0].id).toBe("name");
      expect(columns[0].enableColumnFilter).toBe(true);
      expect(columns[0].enableSorting).toBe(false);

      expect(columns[1].id).toBe("actions");
      expect(columns[1].enableColumnFilter).toBe(false);
      expect(columns[1].enableSorting).toBe(false);
    });
  });
});
