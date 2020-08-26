import React from "react"
/**
 * 
 * @param {*} settings Fragment from api.
 */
export const SynthesizedTable = ({ settings }) => {
  return (
    <div className="synthesized-table ds-u-margin-top--4">
      <legend className="ds-c-field__hint" for="synthesized-table-1">{settings.title}</legend>
      <table class="ds-c-table ds-u-margin-top--2" id="synthesized-table-1">
        <caption class="ds-c-table__caption">{settings.hint}</caption>
        {/* headers={fragment.fieldset_info.headers} rows={fragment.fieldset_info.rows} */}
        <thead>
          <tr>
            <th scope="col">All children ages 0-18</th>
            <th scope="col">Number</th>
            <th scope="col">Percent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Number of children at the start of the cohort</th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Number of children continuously enrolled 6 months later</th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Number of children continuously enrolled 12 months later</th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Number of children continuously enrolled 18 months later</th>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
