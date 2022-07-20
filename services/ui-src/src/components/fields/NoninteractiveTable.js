import React from "react";
import PropTypes from "prop-types";

const NoninteractiveTable = ({ question, tableTitle }) => {
  const columnWidth = 100 / question.fieldset_info.headers.length;
  // eslint-disable-next-line
  let percentLocation = [];
  let count = -1;
  return (
    <div className="non-interactive-table ds-u-margin-top--2">
      <table
        className="ds-c-table"
        width="100%"
        summary={
          question.label ||
          tableTitle ||
          "This is a table for the CARTS Application"
        }
      >
        <thead>
          <tr>
            {question.fieldset_info.headers.map((header) => {
              count += 1;
              // captures the location of a percent element
              if (String(header).toLowerCase().includes("percent")) {
                percentLocation[count] = true;
              } else {
                percentLocation[count] = false;
              }
              return (
                <th width={`${columnWidth}%`} name={header} key={header}>
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {question.fieldset_info.rows.map((row) => {
            count = -1;
            let rowLabel = "";
            return (
              <tr key={count}>
                {row.map((value, index) => {
                  count += 1;
                  // adds % to any element that has percent in the header and adds commas via toLocaleString
                  if (percentLocation[count] === true) {
                    /*
                     * TODO Remove this custom logic when rewriting backend
                     * This is part of the story to dynamically calculate percent change: OY2-13439 and is the absolute wrong way to do this.
                     */
                    if (
                      (row[0] === "Medicaid Expansion CHIP" ||
                        row[0] === "Separate CHIP") &&
                      question.fieldset_info.headers[1]?.includes(
                        "Number of children enrolled in FFY"
                      )
                    ) {
                      // The percent change calculation times 100 to give the percent in the correct format
                      let returnValue = ((row[2] - row[1]) / row[1]) * 100;
                      if (!returnValue) {
                        returnValue = 0;
                      }
                      if (row[1] === 0 && row[2] > 0) {
                        returnValue = "-";
                        return index === 0 ? (
                          <th
                            className="row-header"
                            aria-label="Row header:"
                            width={`${columnWidth}%`}
                          >
                            {returnValue.toLocaleString()}
                          </th>
                        ) : (
                          <td
                            aria-label={`Row: ${rowLabel}, `}
                            width={`${columnWidth}%`}
                          >
                            {returnValue.toLocaleString()}
                          </td>
                        );
                      }
                      returnValue = Math.round(returnValue * 1000) / 1000;
                      return index === 0 ? (
                        <th
                          className="row-header"
                          aria-label="Row header:"
                          width={`${columnWidth}%`}
                        >
                          {returnValue.toLocaleString()}%
                        </th>
                      ) : (
                        <td
                          aria-label={`Row: ${rowLabel}, `}
                          width={`${columnWidth}%`}
                        >
                          {returnValue.toLocaleString()}%
                        </td>
                      );
                    }
                    //End of the custom logic, that should really never have been done in the first place
                    return index === 0 ? (
                      <th
                        className="row-header"
                        aria-label="Row header:"
                        width={`${columnWidth}%`}
                      >
                        {value.toLocaleString()}%
                      </th>
                    ) : (
                      <td
                        aria-label={`Row: ${rowLabel}, `}
                        width={`${columnWidth}%`}
                      >
                        {value.toLocaleString()}%
                      </td>
                    );
                    // eslint-disable-next-line
                  } else {
                    if (index === 0) {
                      value.toLocaleString();
                      rowLabel = `${value.toLocaleString()}`;
                    }
                    return index === 0 ? (
                      <th
                        className="row-header"
                        aria-label="Row header:"
                        width={`${columnWidth}%`}
                      >
                        {value.toLocaleString()}
                      </th>
                    ) : (
                      <td
                        aria-label={`Row: ${rowLabel}, `}
                        width={`${columnWidth}%`}
                      >
                        {value.toLocaleString()}
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
NoninteractiveTable.propTypes = {
  question: PropTypes.object.isRequired,
  tableTitle: PropTypes.string,
};
export { NoninteractiveTable };
export default NoninteractiveTable;
