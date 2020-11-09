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
  const [rangeError, setRangeError] = useState("");
let a =0;
  const [rangeValues, setRangeValues] = useState(values);

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

  const validateInequality = () => {
    setRangeValues([values[0], values[1]])

    if (values.length === 2) {
      const start = parseFloat(values[0]);
      const end = parseFloat(values[1]);

      if (start > end) {
        setRangeError("Start value must be less than end value");
      } else {
        setRangeError("");
      }
    }
  };

  const changeStart = ({ target: { value } }) => {
    setRangeValues([value, rangeValues[1]])
    onChange(row, index, 0, value);
  };

  const changeEnd = ({ target: { value } }) => {
    setRangeValues([rangeValues[0], value])
    onChange(row, index, 1, value);
  };

  return (
    <div className="cmsrange">
      <div className="cmsrange-outer ds-l-container">
        {rangeError ? <div className="errors">{rangeError}</div> : null}
        <div className="ds-l-row">
          <div className="cmsrange-container range-start">
            <Input
              id={`${id}-${row}-${index}-0`}
              label={category[0]}
              className="cmsrange-input"
              question={startQuestion}
              onChange={changeStart}
              onBlur={validateInequality}
              value={rangeValues[0] ? rangeValues[0] : values[0]}
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
              onBlur={validateInequality}
              value={rangeValues[1] ? rangeValues[1] : values[1]}
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

    // Set all values to values
    let a = (values[0][0][1] ? parseFloat(values[0][0][0]) : 0);
    let bee = (values[0][0][1] ? parseFloat(values[0][0][1]) : 0);
    let c = (values[0][1][0] ? parseFloat(values[0][1][0]) : 0);
    let d = (values[0][1][1] ? parseFloat(values[0][1][1]) : 0);

    // Overwrite with current value
    if(category == 0) {
      if(index == 0) {
        a = value ? parseFloat(value) : 0;
      } else {
        bee = value ? parseFloat(value) : 0;
      }
    } else {
      if(index == 0) {
        c = value ? parseFloat(value) : 0;
      } else {
        d = value ? parseFloat(value) : 0;
      }
    }

    let e = 0;

    values[row][category][index] = value;
    setValues(values);

    if(a <= bee && c <= d) {
      let f = 0;

      onChange({target: {name: question.id, value: values}});
    }
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
