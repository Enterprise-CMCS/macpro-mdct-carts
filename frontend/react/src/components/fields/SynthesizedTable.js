import React from "react";
import { connect } from "react-redux";
import { selectTarget } from "./../../store/selectors";
import jsonpath from "../../util/jsonpath";

/**
 *
 * @param {*} data Fragment from api.
 */
const SynthesizedTable = ({ data, state }) => {
  return (
    <div className="synthesized-table ds-u-margin-top--2">
      <legend className="table__legend ds-h4" for="synthesized-table-1">
        {data.label}
      </legend>
      <table class="ds-c-table ds-u-margin-top--2" id="synthesized-table-1">
        <caption class="ds-c-table__caption">{data.hint}</caption>
        <thead>
          <tr>
            {/* headers={fragment.fieldset_info.headers} rows={fragment.fieldset_info.rows} */}
            {data.fieldset_info.headers.map((header) => {
              return <th scope="col">{header.contents}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.fieldset_info.rows.map((row) => {
            return (
              <tr>
                {row.map((cell) => {
                  if (cell.contents) {
                    return (
                      cell.contents && <td scope="col">{cell.contents}</td>
                    );
                  }
                  if (cell.targets && !cell.actions) {
                    // return <td>{jsonpath.query(state, cell.targets[0])}</td>;
                    return (
                      <td>
                        <pre>{cell.targets[0]}</pre>
                      </td>
                    );
                  }
                  if (cell.targets && cell.actions) {
                    return (
                      <td>
                        <pre>calculate {cell.actions[0]}</pre>
                      </td>
                    );
                  } else return null;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state, { target }) => ({
  // text: selectTarget(state, target) || null,
});

export default connect(mapStateToProps)(SynthesizedTable);
