import React from "react";
import { useSelector, shallowEqual } from "react-redux";
//utils
import synthesizeValue from "../../util/synthesize";
//types
import PropTypes from "prop-types";

const SynthesizedTable = ({ question, tableTitle, printView }) => {
  const [allStatesData, stateName, stateUserAbbr, chipEnrollments, formData] =
    useSelector(
      (state) => [
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData,
      ],
      shallowEqual
    );

  const rows = question.fieldset_info.rows.map((row) => {
    let contents = row;
    if (printView) {
      contents = row.filter((cell) => cell?.mask !== "lessThanEleven");
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
    ? question.fieldset_info.headers.filter(
        (header) => header?.mask !== "lessThanEleven"
      )
    : question.fieldset_info.headers;

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

export default SynthesizedTable;
