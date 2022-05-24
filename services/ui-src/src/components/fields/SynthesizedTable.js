import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import synthesizeValue from "../../util/synthesize";

const SynthesizedTable = ({ headers, rows, question }) => {
  return (
    <div className="synthesized-table ds-u-margin-top--2">
      <table
        className="ds-c-table ds-u-margin-top--2"
        id="synthesized-table-1"
        summary={question.label || "This is a table for the CARTS Application"}
      >
        {headers && (
          <thead>
            <tr>
              {question.fieldset_info.headers.map((header, index) => (
                <th scope="col" key={index}>
                  {header.contents}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, index) => {
            return (
              <tr key={index}>
                {row.map((cell, index) => (
                  <td key={index}>{cell.contents}</td>
                ))}
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
  rows: PropTypes.array.isRequired,
};

const mapStateToProps = (state, { question }) => {
  const rows = question.fieldset_info.rows.map((row) =>
    row.map((cell) => {
      const value = synthesizeValue(cell, state);

      return typeof value.contents === "number" && Number.isNaN(value.contents)
        ? { contents: "Not Available" }
        : value;
    })
  );

  return { rows };
};

const ConnectedSynthesizedTable = connect(mapStateToProps)(SynthesizedTable);

export { ConnectedSynthesizedTable as SynthesizedTable };
export default ConnectedSynthesizedTable;
