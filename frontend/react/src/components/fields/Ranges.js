import CMSRanges from "./CMSRanges";
import React, { useCallback, useState } from "react";
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
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
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

const Ranges = ({ onChange, question }) => {
  const {
    answer: {
      entry,
      entry_max,
      entry_min,
      header,
      range_categories,
      range_type,
    },
  } = question;

  const [values, setValues] = useState(() => {
    console.log(": : : : : : creating ranges state");
    if (Array.isArray(entry)) {
      return entry;
    }

    const numberToCreate = entry_min > 0 ? entry_min : 1;
    return [...Array(numberToCreate)].map(() =>
      range_categories.map(() => [null, null])
    );
  });

  const rowChange = (row, category, index, value) => {
    values[row][category][index] = value;
    console.log(
      `setting values for row ${index}\n to ${JSON.stringify(values)}`
    );
    setValues(values);
    onChange({ target: { name: question.id, value: values } });
  };

  const addRow = () => {
    if (values.length < entry_max || entry_max == 0) {
      setValues([...values, range_categories.map(() => [null, null])]);
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
            category={range_categories[index]}
            id={question.id}
            index={index}
            onChange={rowChange}
            row={row}
            type={range_type[index]}
            values={categoryValues}
          />
        ))
      )}

      {values.length < entry_max || entry_max == 0 ? (
        <Button onClick={addRow} type="button" variation="primary">
          Add another? <FontAwesomeIcon icon={faPlus} />
        </Button>
      ) : null}
      {values.length > entry_min || entry_min == 0 ? (
        <Button onClick={removeRow} type="button" variation="primary">
          Remove Last Entry <FontAwesomeIcon icon={faMinusCircle} />
        </Button>
      ) : null}
    </div>
  );
};

export { Range, Ranges };
