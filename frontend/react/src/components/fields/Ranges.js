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

  let Input = Text;
  if (inputs.has(type)) {
    Input = inputs.get(type);
  }

  const startQuestionObject = {
    id: `${id}-row-${row}-${index}-start`,
    answer: {
      entry: values ? values[0] : "",
    },
  };

  const endQuestionObject = {
    id: `${id}-row-${row}-${index}-end`,
    answer: {
      entry: values ? values[1] : "",
    },
  };

  const [startQuestion, setStartQuestion] = useState(startQuestionObject);
  const [endQuestion, setEndQuestion] = useState(endQuestionObject);

  let rangeStart = useRef();
  let rangeEnd = useRef();

  useEffect(() => {
    setStartQuestion(startQuestionObject);
    setEndQuestion(endQuestionObject);
  }, [values]);

  const validateInequality = () => {
    if (values.length === 2) {
      const start = parseInt(values[0], 10);
      const end = parseInt(values[1], 10);

      if (start > end) {
        setRangeError("Start value must be less than end value");
        // reset both values in redux
        // onChange(row, index, 0, "");
        // onChange(row, index, 1, "");
      } else {
        setRangeError("");
      }
    }
  };

  // Any more ideas??
  // Make it stateful?? Issue: state needs to be as updated as possible,
  // make sure it never gets stale
  // Use effect

  // Plan Z:
  // If theres an error, go into redux and change all values to null

  const changeStart = ({ target: { value } }) => {
    // call some validation function
    chronologyValidation();
    // check that both values are present
    onChange(row, index, 0, value);
  };

  const changeEnd = ({ target: { value } }) => {
    // call some validation function
    chronologyValidation();
    // check that both values are present
    onChange(row, index, 1, value);
  };

  const chronologyValidation = () => {
    console.log("Range start??", rangeStart);
    console.log("Range end??", rangeEnd);

    // Are both values present ?
    // Are they in the right order?
    // return true

    // return false
  };

  return (
    <div className="cmsrange">
      <div className="cmsrange-outer ds-l-container">
        {rangeError ? <div className="errors">{rangeError}</div> : null}
        <div className="ds-l-row">
          <div className="cmsrange-container range-start">
            <Input
              // ref={rangeStart}
              ref={(input) => {
                console.log("INPUT???", input);
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

  const [values, setValues] = useState(() => {
    if (Array.isArray(entry)) {
      return entry;
    }

    const numberToCreate = min > 0 ? min : 1;
    return [...Array(numberToCreate)].map(() =>
      categories.map(() => [null, null])
    );
  });

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
