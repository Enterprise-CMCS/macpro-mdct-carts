import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";

import { Money } from "./Money";
import { Percentage } from "./Percentage";
import { Text } from "./Text";

const inputs = new Map([
  ["money", Money],
  ["percentage", Percentage],
  ["text", Text],
]);

const Range = ({ category, id, index, onChange, row, type, values }) => {
  const [rangeError, setRangeError] = useState("");

  // This choses the appropriate mask for the <Input/>, Month, Percentage or Text
  let Input = Text;
  if (inputs.has(type)) {
    Input = inputs.get(type);
  }

  // Extract start value from redux's nested array, passed down from <Ranges/>
  // This is an object because of the way it is eventually read by the Textfield component (in Integer.js or Text.js)
  const startQuestionObject = {
    id: `${id}-row-${row}-${index}-start`,
    answer: {
      entry: values ? values[0] : "",
    },
  };

  // Extract start value from redux's nested array, passed down from <Ranges/>
  // This is an object because of the way it is eventually read by the Textfield component (in Integer.js or Text.js)
  const endQuestionObject = {
    id: `${id}-row-${row}-${index}-end`,
    answer: {
      entry: values ? values[1] : "",
    },
  };

  // Set both the start value object and the end value objects to STATE
  const [startQuestion, setStartQuestion] = useState(startQuestionObject);
  const [endQuestion, setEndQuestion] = useState(endQuestionObject);

  // This will update both the start and end objects in STATE when the value from redux is changed
  useEffect(() => {
    setStartQuestion(startQuestionObject);
    setEndQuestion(endQuestionObject);
  }, [values]);

  // Create input references for both the start and end input fields
  let rangeStart = useRef();
  let rangeEnd = useRef();

  // This helper function checks that both values are present from REDUX and validates them
  // This helper function sets a validation error on the UI but currently does nothing to prevent...
  // ... invalid data from reaching REDUX
  const validateInequality = () => {
    if (values.length === 2) {
      const start = parseInt(values[0], 10);
      const end = parseInt(values[1], 10);

      if (start > end) {
        setRangeError("Start value must be less than end value");
      } else {
        setRangeError("");
      }
    }
  };

  // This function returns a boolean after confirming chronology
  // This function is truggered before either input field sends data to REDUX
  const chronologyValidation = () => {
    console.log("Range start??", rangeStart);
    console.log("Range end??", rangeEnd);

    // PSEUODOCODE:
    // -- Are both values present ?
    // ---- Are they in the right order?
    // ------ return true

    // -- return false
  };

  // This function is triggered by the first input onChange
  const changeStart = ({ target: { value } }) => {
    chronologyValidation(); // call some validation function

    onChange(row, index, 0, value); // Sends data to redux
  };

  // This function is triggered by the second input onChange
  const changeEnd = ({ target: { value } }) => {
    chronologyValidation(); // call some validation function

    onChange(row, index, 1, value); // Sends data to redux
  };

  // Any more ideas??
  // Make it stateful?? Issue: state needs to be as updated as possible,
  // make sure it never gets stale
  // Use effect

  // Plan Z:
  // If theres an error, go into redux and change all values to null

  return (
    <div className="cmsrange">
      <div className="cmsrange-outer ds-l-container">
        {rangeError ? <div className="errors">{rangeError}</div> : null}
        <div className="ds-l-row">
          <div className="cmsrange-container range-start">
            <Input
              // ref={rangeStart}
              ref={(input) => {
                rangeStart = input;
              }}
              id={`${id}-${row}-${index}-0`}
              label={category[0]}
              className="cmsrange-input"
              question={startQuestion}
              onChange={changeStart}
              onBlur={validateInequality}
            />
          </div>
          <div className="cmsrange-arrow">
            <i className="fa fa-arrow-right" aria-hidden="true" />
          </div>
          <div className="cmsrange-container cmsrange-end">
            <Input
              // ref={rangeEnd}
              ref={(input) => {
                rangeEnd = input;
              }}
              id={`${id}-${row}-${index}-1`}
              label={category[1]}
              className="cmsrange-input"
              question={endQuestion}
              onChange={changeEnd}
              onBlur={validateInequality}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
Range.propTypes = {
  category: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  row: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
};

const Ranges = ({ onChange, question }) => {
  const {
    answer: {
      entry,
      entry_max: max,
      entry_min: min,
      header,
      range_categories: categories,
      range_type: types,
    },
  } = question;

  // DELETE:
  // Example entry
  //     "entry": [
  //     [["21", "40"], ["30", "50"]],
  //     [["41", "60"], ["60", "80"]],
  // ]

  // If there is a saved "entry" in redux, save as the variable "values"
  const [values, setValues] = useState(() => {
    if (Array.isArray(entry)) {
      return entry;
    }

    // TODO: Document what min and max mean and do
    const numberToCreate = min > 0 ? min : 1;
    return [...Array(numberToCreate)].map(() =>
      categories.map(() => [null, null])
    );
  });

  // This function is triggered in <Range/> onChange
  // This function takes in input and places it where it should be in the nested entry array

  const rowChange = (row, category, index, value) => {
    values[row][category][index] = value;
    setValues(values);
    onChange({ target: { name: question.id, value: values } });
  };

  const addRow = () => {
    if (values.length < max || max === 0) {
      setValues([...values, categories.map(() => [null, null])]);
    }
  };

  const removeRow = () => {
    if (values.length) {
      setValues(values.slice(0, values.length - 1));
    }
  };

  return (
    <div className="cmsranges">
      {header && <h3>{header}</h3>}

      {values.map((rowValues, row) =>
        rowValues.map((categoryValues, index) => (
          <Range
            key={`${row}.${index}`}
            category={categories[index]}
            id={question.id}
            index={index}
            onChange={rowChange}
            row={row}
            type={types[index]}
            values={categoryValues}
          />
        ))
      )}

      {values.length < max || max === 0 ? (
        <Button onClick={addRow} type="button" variation="primary">
          Add another? <FontAwesomeIcon icon={faPlus} />
        </Button>
      ) : null}
      {values.length > min || min === 0 ? (
        <Button onClick={removeRow} type="button" variation="primary">
          Remove Last Entry <FontAwesomeIcon icon={faMinusCircle} />
        </Button>
      ) : null}
    </div>
  );
};
Ranges.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { Range, Ranges };
