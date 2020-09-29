import React from "react";
import PropTypes from "prop-types";

const NoninteractiveTable = ({ question }) => {
  const columnWidth = 100 / question.fieldset_info.headers.length;
  return (
    <table className="ds-c-table" width="100%">
      <thead>
        <tr>
          {question.fieldset_info.headers.map(function (header) {
            return (
              <th width={`${columnWidth}%`} name={`${header}`}>
                {header}
              </th>
            );
          })}
        </tr>
      </thead>
      {question.fieldset_info.rows.map((row) => {
        return (
          <tr>
            {row.map((value) => {
              return <td width={`${columnWidth}%`}>{value}</td>;
            })}
          </tr>
        );
      })}
    </table>
  );
};
NoninteractiveTable.propTypes = {
  question: PropTypes.object.isRequired,
};
export { NoninteractiveTable };
export default NoninteractiveTable;
