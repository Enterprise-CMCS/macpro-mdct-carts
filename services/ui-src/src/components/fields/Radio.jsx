import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import Question from "./Question";
import { setAnswerEntry } from "../../actions/initial";

const Radio = ({ question, ...props }) => {
  const [selected, setSelected] = useState(question.answer.entry);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelected(value);
    dispatch(setAnswerEntry(name, value));
  };

  const children =
    question.questions?.length > 0 ? (
      <div className="radio-children">
        {question.questions.map((q, i) => (
          <Question key={q.id || i} question={q} />
        ))}
      </div>
    ) : null;

  return (
    <div className="ds-c-fieldset">
      {question.answer.options.map(({ label, value }) => {
        const isChecked = selected === value;

        return (
          <div className="radio-container" key={props.name + "-" + value}>
            <input
              key={value}
              checked={isChecked}
              type="radio"
              value={value}
              name={props.name}
              disabled={props.disabled}
              onChange={handleChange}
              id={props.name + "-" + value}
            />
            <label className="label-radio" htmlFor={props.name + "-" + value}>
              {label}
            </label>
            {isChecked && children}
          </div>
        );
      })}
    </div>
  );
};
Radio.propTypes = {
  question: PropTypes.object.isRequired,
  name: PropTypes.string,
};

export { Radio };
export default Radio;
