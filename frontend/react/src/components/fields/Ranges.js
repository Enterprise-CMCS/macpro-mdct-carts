import React, { useState } from "react";
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
  let Input = Text;
  if (inputs.has(type)) {
    Input = inputs.get(type);
  }

  const startQuestion = {
    id: `${id}-row-${row}-${index}-start`,
    answer: {
      entry: values ? values[0] : "",
    },
  };

  const endQuestion = {
    id: `${id}-row-${row}-${index}-end`,
    answer: {
      entry: values ? values[1] : "",
    },
  };

  const changeStart = ({ target: { value } }) => {
    onChange(row, index, 0, value);
  };

  const changeEnd = ({ target: { value } }) => {
    onChange(row, index, 1, value);
  };

  return (
    <div className="cmsrange">
      <div className="cmsrange-outer ds-l-container">
        <div className="ds-l-row">
          <div className="cmsrange-container range-start">
            <Input
              id={`${id}-${row}-${index}-0`}
              label={category[0]}
              className="cmsrange-input"
              question={startQuestion}
              onChange={changeStart}
            />
          </div>
          <div className="cmsrange-arrow">
            <i className="fa fa-arrow-right" aria-hidden="true" />
          </div>
          <div className="cmsrange-container cmsrange-end">
            <Input
              id={`${id}-${row}-${index}-1`}
              label={category[1]}
              className="cmsrange-input"
              question={endQuestion}
              onChange={changeEnd}
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

  //   "entry": [
  //   [["21", "40"]],
  // ]

  const [rangeError, setRangeError] = useState("");

  const rowChange = (row, category, index, value) => {
    values[row][category][index] = value;

    // Perform validation here
    // Set row specific error messages to state here

    const rowToValiate = values[row][category];
    const startValue = rowToValiate[0];
    const endValue = rowToValiate[1];

    // Update Ranges local state
    setValues(values);

    // if (startValue && endValue) {
    //   const start = parseFloat(startValue, 10);
    //   const end = parseFloat(endValue, 10);

    //   if (start >= end) {
    //     setRangeError("Start value must be less than end value");
    //   } else {
    //     setRangeError("");

    //     // Where it gets sent to REDUX
    //     onChange({ target: { name: question.id, value: values } });
    //   }
    // }
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

      {rangeError ? <div className="errors">{rangeError}</div> : null}

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
