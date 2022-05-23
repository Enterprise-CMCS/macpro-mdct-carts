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
              {headers.map((header, index) => (
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
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
};

const mapStateToProps = (state, { question }) => {
  const headers = question.fieldset_info.headers.map((header) => {
    return header.contents === "" ? { contents: "Type" } : header;
  });

  const rows = question.fieldset_info.rows.map((row) =>
    row.map((cell) => {
      const value = synthesizeValue(cell, state);

      if (Number.isNaN(value.contents)) {
        return { contents: "Not Available" };
      } else if (!value.contents) {
        return { contents: "Not Answered" };
      } else if (Array.isArray(value.contents)) {
        return value.contents[0] === ""
          ? { contents: "Not Answered" }
          : { contents: value.contents[0] };
      }
      return value;
    })
  );

  return { headers, rows };
};

const ConnectedSynthesizedTable = connect(mapStateToProps)(SynthesizedTable);

export { ConnectedSynthesizedTable as SynthesizedTable };
export default ConnectedSynthesizedTable;
