import React from "react";
import { useSelector, shallowEqual } from "react-redux";
//utils
import synthesizeValue from "../../util/synthesize";
import { lteMask } from "../../util/constants";
//types
import PropTypes from "prop-types";

const SynthesizedTable = ({ question, tableTitle, printView }) => {
  const { headers, rows } = useSelector(
    (state) => getTableContents(state, question, printView),
    shallowEqual
  );

  return (
    <div className="synthesized-table ds-u-margin-top--2">
      <table
        className="ds-c-table ds-u-margin-top--2"
        id="synthesized-table-1"
        summary={
          question.label ||
          tableTitle ||
          "This is a table for the CARTS Application"
        }
      >
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th scope="col" key={index}>
                {header.contents}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            let rowLabel;
            return (
              <tr key={index}>
                {row.map((cell, index) => {
                  if (index === 0 && !question.all_columns_have_data) {
                    rowLabel = cell.contents;
                    return (
                      <th
                        className="row-header"
                        aria-label={`Row Header:`}
                        key={index}
                      >
                        {" "}
                        {cell.contents}
                      </th>
                    );
                  } else {
                    return (
                      <td key={index} aria-label={`Row: ${rowLabel}, `}>
                        {cell.contents}
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
SynthesizedTable.propTypes = {
  question: PropTypes.object.isRequired,
  tableTitle: PropTypes.string.isOptional,
};

const getTableContents = (state, question, printView) => {
  const { allStatesData, formData } = state;
  const stateName = state.global.stateName;
  const stateUserAbbr = state.stateUser.abbr;
  const chipEnrollments = state.enrollmentCounts.chipEnrollments;
  const { headers: questionHeaders, rows: questionRows } =
    question.fieldset_info;

  const rows = questionRows.map((row) => {
    let contents = row;
    if (printView) {
      contents = row.filter((cell) => cell?.mask !== lteMask);
    }
    return contents.map((cell) => {
      const value = synthesizeValue(
        cell,
        allStatesData,
        stateName,
        stateUserAbbr,
        chipEnrollments,
        formData
      );

      return typeof value.contents === "number" && Number.isNaN(value.contents)
        ? { contents: "Not Available" }
        : value;
    });
  });
  const headers = printView
    ? questionHeaders.filter((header) => header?.mask !== lteMask)
    : questionHeaders;
  return { headers, rows };
};

export default SynthesizedTable;
