import React from "react";
import { connect } from "react-redux";
import { synthesizeValue } from "../../util/synthesize";

/**
 *
 * @param {*} data Fragment from api.
 */
const SynthesizedTable = ({ question, rows }) => {
  return (
    <div className="synthesized-table ds-u-margin-top--2">
      <legend className="table__legend ds-h4" for="synthesized-table-1">
        {question.label}
      </legend>
      <table class="ds-c-table ds-u-margin-top--2" id="synthesized-table-1">
        <caption class="ds-c-table__caption">{question.hint}</caption>
        <thead>
          <tr>
            {question.fieldset_info.headers.map((header) => (
              <th scope="col">{header.contents}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            return (
              <tr>
                {row.map((cell) => (
                  <td scope="col">{cell.contents}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state, { question }) => {
  const rows = question.fieldset_info.rows.map((row) =>
    row.map((cell) => synthesizeValue(cell, state))
  );

  return { rows };
};

const ConnectedSynthesizedTable = connect(mapStateToProps)(SynthesizedTable);

export { ConnectedSynthesizedTable as SynthesizedTable };
