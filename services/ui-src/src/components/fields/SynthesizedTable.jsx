import React from "react";
import { useSelector, shallowEqual } from "react-redux";
//utils
import synthesizeValue from "../../util/synthesize";
import { lteMask } from "../../util/constants";
//types
import PropTypes from "prop-types";

const SynthesizedTable = ({ question, printView }) => {
  const [
    allStatesData,
    stateName,
    stateUserAbbr,
    chipEnrollments,
    formData,
    lastYearFormData,
  ] = useSelector(
    (state) => [
      state.allStatesData,
      state.global.stateName,
      state.stateUser.abbr,
      state.enrollmentCounts.chipEnrollments,
      state.formData,
      state.lastYearFormData,
    ],
    shallowEqual
  );
  const rows = question.fieldset_info.rows.map((row) => {
    let contents = row;

    /*
     * The below if statement is logic surrounding the <11 data suppression policy.
     * Specific fields related to the collection of data surrounding children are
     * not allowed to be displayed in tables if their value is 1 <= val <= 10. In
     * these instances we remove that cell all together. However, a specific caveat
     * is made for the number/sumAndPercentage masks. They need to show their cell
     * but be replaced with '<11'.
     */
    if (printView) {
      contents = row.filter((cell) => {
        const specialMasks = ["numberAndPercentage", "sumAndPercentage"];
        if (
          cell?.mask === lteMask &&
          specialMasks.includes(cell?.actions?.[0])
        ) {
          return cell;
        }
        return cell?.mask !== lteMask;
      });
    }
    return contents.map((cell) => {
      const value = synthesizeValue(
        cell,
        allStatesData,
        stateName,
        stateUserAbbr,
        chipEnrollments,
        formData,
        lastYearFormData,
        printView
      );

      return typeof value.contents === "number" && Number.isNaN(value.contents)
        ? { contents: "Not Available" }
        : value;
    });
  });

  const headers = printView
    ? question.fieldset_info.headers.filter(
        (header) => header?.mask !== lteMask
      )
    : question.fieldset_info.headers;

  return (
    <div className="synthesized-table">
      <table
        className="ds-c-table"
        summary={question.label || "This is a table for the CARTS Application"}
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
};

export default SynthesizedTable;
