import { shouldDisplay } from "../Utils/helperFunctions";
import React from "react";
import FPL from "../layout/FPL";
import CMSLegend from "../fields/CMSLegend";
import { Choice, TextField } from "@cmsgov/design-system-core";

export const generateMoneyField = (item) => {
  return (
    <>
      <CMSLegend label={item.label} id={item.id} type="subquestion" />
      <TextField
        className="fpl-input"
        // label={item.label}
        inputMode="currency"
        mask="currency"
        pattern="[0-9]*"
        value={item.answer.entry}
      />
    </>
  );
};

export const generateRangeField = (item) => {
  return (
    <>
      <CMSLegend label={item.label} id={item.id} type="subquestion" />
      <FPL fieldLabels={item.answer.range_categories} />
    </>
  );
};

export const generateTextLongField = (item, legendType) => {
  return (
    <>
      <CMSLegend label={item.label} id={item.id} type={legendType} />
      <TextField
        multiline
        class="ds-c-field"
        name={item.id}
        value={item.answer.entry}
        type="text"
        name={item.id}
        rows="6"
      />
    </>
  );
};

/**
 * Function that returns JSX for radio & checkbox questions
 * @function generateRadioCheckField
 * @param {object} item - Individual question from JSON
 * @param {array} key - Array of answer selection. Key & value
 * @param {string} selectionType - Indicates radio or checkbox
 * @param {int} index - Index of the parent loop (determines whether to display label)
 * @param {string} legendType - Indicates question or subquestion
 * @returns {Fragment} - JSX element, CMS Choise and Legend with question text
 */
export const generateRadioCheckField = (
  item,
  key,
  selectionType,
  index,
  legendType
) => {
  const isCheckedChild = key[1] === item.answer.entry ? "checked" : null;
  return (
    <>
      {index === 0 ? (
        <CMSLegend label={item.label} id={item.id} type={legendType} />
      ) : null}
      {/* Output only matching answers */}

      <Choice
        className="fpl-input"
        name={item.id}
        value={key[1]}
        type={selectionType}
        checked={isCheckedChild}
      >
        {key[0]}
      </Choice>
    </>
  );
};
