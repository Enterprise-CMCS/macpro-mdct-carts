import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
// components
import {
  Table as TableRoot,
  TableBody as Tbody,
  TableCell as Td,
  TableCell as Th,
  TableHead as Thead,
  TableRow as Tr,
} from "@cmsgov/design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownLong,
  faArrowUpLong,
  faArrowsUpDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const SortableTable = ({ columns, data, initialSorting = [] }) => {
  const headerRefs = useRef({});
  const [sorting, setSorting] = useState(initialSorting);
  const [columnFilters, setColumnFilters] = useState([]);
  const [headerLabels, setHeaderLabels] = useState({});
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      sorting,
    },
  });

  useEffect(() => {
    const relKeys = Object.keys(headerRefs.current);
    const refLabels = relKeys.reduce((obj, key) => {
      obj[key] = headerRefs.current[key].textContent || "";
      return obj;
    }, {});
    setHeaderLabels(refLabels);
  }, [headerRefs.current]);

  return (
    <TableRoot className="sortable-table" aria-labelledby="reports-heading">
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr className="report-header" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const ariaSort = header.column.getIsSorted()
                ? {
                    "aria-sort":
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : "descending",
                  }
                : {};

              return (
                <Th key={header.id} scope="col" {...ariaSort}>
                  {header.column.getCanSort() && (
                    <button
                      className="sortable-button sortable-table-header"
                      onClick={header.column.getToggleSortingHandler()}
                      aria-label={headerLabels[header.id]}
                      type="button"
                    >
                      <span ref={(el) => (headerRefs.current[header.id] = el)}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      <span className="sortable-arrows" aria-hidden="true">
                        {!header.column.getIsSorted() && (
                          <FontAwesomeIcon icon={faArrowsUpDown} />
                        )}
                        {header.column.getIsSorted() === "asc" && (
                          <FontAwesomeIcon icon={faArrowUpLong} />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <FontAwesomeIcon icon={faArrowDownLong} />
                        )}
                      </span>
                    </button>
                  )}
                  {!header.column.getCanSort() && (
                    <span className="sortable-table-header">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                  )}
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              return (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </TableRoot>
  );
};

export function generateColumns(headRow, isAdmin, customCellsCallback) {
  const columnHelper = createColumnHelper();

  function getCell(headKey, info) {
    // Undefined must return null or cell won't render
    const value = info.getValue() ?? null;
    let cell;

    if (customCellsCallback) {
      cell = customCellsCallback(headKey, value, info.row.original);
    }

    return cell ?? value;
  }

  return Object.keys(headRow)
    .filter((headKey) => {
      const { admin, stateUser } = headRow[headKey];
      const hideFromAdmin = isAdmin && stateUser;
      const hideFromStateUser = !isAdmin && admin === true;

      if (hideFromAdmin || hideFromStateUser) {
        return false;
      }
      return true;
    })
    .map((headKey) => {
      const {
        filter = true,
        header,
        hidden = false,
        sort = true,
      } = headRow[headKey];

      return columnHelper.accessor((row) => row[headKey], {
        id: headKey,
        header: () =>
          hidden ? <span className="sortable-hidden">{header}</span> : header,
        cell: (info) => getCell(headKey, info),
        enableColumnFilter: hidden ? false : filter,
        enableSorting: hidden ? false : sort,
      });
    });
}

SortableTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  initialSorting: PropTypes.array,
};

export default SortableTable;
