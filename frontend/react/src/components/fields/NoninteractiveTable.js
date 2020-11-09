import React from "react";
import PropTypes from "prop-types";

const NoninteractiveTable = ({ question }) => {
  const columnWidth = 100 / question.fieldset_info.headers.length;
  // eslint-disable-next-line
  let percentLocation = [];
  let count = -1;
  return (
    <div className="non-interactive-table ds-u-margin-top--2">
      <table className="ds-c-table" width="100%">
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
                <th width={`${columnWidth}%`} name={`${header}`}>
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {question.fieldset_info.rows.map((row) => {
            count = -1;
            return (
              <tr>
                {row.map((value) => {
                  count += 1;
                  // adds % to any element that has percent in the header and adds commas via toLocaleString
                  if (percentLocation[count] === true) {
                    return (
                      <td width={`${columnWidth}%`}>
                        {value.toLocaleString()}%
                      </td>
                    );
                    // eslint-disable-next-line
                  } else {
                    return (
                      <td width={`${columnWidth}%`}>
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
};
export { NoninteractiveTable };
export default NoninteractiveTable;
