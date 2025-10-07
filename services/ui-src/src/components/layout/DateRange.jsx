import React, { useEffect, useState } from "react";
//components
import { TextField } from "@cmsgov/design-system";
//types
import PropTypes from "prop-types";

const DateRange = ({
  onChange,
  question,
  year = new Date().getFullYear().toString(), // Returns the current year as a default,
  ...props
}) => {
  const [endRangeErr, setEndRangeErr] = useState(false);
  const [monthStart, setMonthStart] = useState("");
  const [monthEnd, setMonthEnd] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [startErrorMessage, setStartErrorMessage] = useState([]);
  const [endErrorMessage, setEndErrorMessage] = useState([]);

  useEffect(() => {
    // Stored value example: ['2019-11-01', '2020-09-01']
    const storedValue = question.answer.entry;
    if (storedValue) {
      // Split each date string into an array and extract month and year variables with destructuring
      const [yearStartValue, monthStartValue] = storedValue[0].split("-"); // ie: '2019' and '11'
      const [yearEndValue, monthEndValue] = storedValue[1].split("-"); // ie: '2020' and '09'

      setMonthStart(monthStartValue ?? "");
      setMonthEnd(monthEndValue ?? "");
      setYearStart(yearStartValue ?? "");
      setYearEnd(yearEndValue ?? "");
    } else {
      setMonthStart("");
      setMonthEnd("");
      setYearStart("");
      setYearEnd("");
    }
  }, []);

  useEffect(() => {
    checkChronology();
  }, [startErrorMessage, endErrorMessage]);

  // This method checks all 4 fields to confirm that the start range is before the end range
  const checkChronology = () => {
    const errorCheck = [...startErrorMessage, ...endErrorMessage]; // Array of all input errors in state

    let monthS = monthStart;
    let monthE = monthEnd;
    let yearS = yearStart;
    let yearE = yearEnd;

    let chronologyError;

    // Ensure that all 4 fields are filled in

    if (monthS && monthE && yearS && yearE) {
      // Turn the input into date objects for easy comparison
      const startDate = new Date(yearS, monthS - 1);
      const endDate = new Date(yearE, monthE - 1);

      monthS = monthS.padStart(2, "0");
      monthE = monthE.padStart(2, "0");

      /*
       * The entry value for daterange must be sent to the server as an array of two strings
       * The format must be an ISO 8601 Date format.
       * Because we are only asking for month/year, the last digit is a placeholder of '01'
       */
      const payload = [`${yearS}-${monthS}-01`, `${yearE}-${monthE}-01`];

      if (startDate > endDate) {
        chronologyError = true;
      } else {
        chronologyError = false;
        if (errorCheck.every((element) => element === undefined)) {
          // If there are no errors present in state
          onChange([question.id, payload]); // Chronology is correct, no errors present, send data to redux
        }
      }
      setEndRangeErr(chronologyError);
    }
  };

  /*
   * This method checks that month input is appropriate:
   * (not empty, max of 2 digits, no letters, between 1 & 12)
   */
  const validateMonth = (input) => {
    let returnString;

    // Handles an empty input field
    if (input === "") {
      returnString = "Month field cannot be empty";
    }

    // Prevents users from putting in more than 2 characters
    if (input.length > 2) {
      returnString = "Month length must not exceed 2";
    }

    // Checks for non-numeric characters
    if (Number.isNaN(parseInt(input, 10)) || /^\d+$/.test(input) === false) {
      returnString = "Please enter a number";
    }

    if (parseInt(input, 10) < 1 || parseInt(input, 10) > 12) {
      // Checks that the month value is within a normal range
      returnString = "Please enter a valid month number";
    }
    return returnString;
  };

  /*
   * This method checks that year input is appropriate
   * (not empty, max of 4 digits, no letters, reasonable year)
   */
  const validateYear = (input) => {
    let returnString;
    // Handles an empty input field
    if (input === "") {
      returnString = "Year field cannot be empty";
    }

    // Prevents users from putting in more than 2 characters
    if (input.length > 4) {
      // failing = true;
      returnString = "Year length must not exceed 4";
    }

    if (
      // Checks for non-numeric characters
      Number.isNaN(parseInt(input, 10)) ||
      /^\d+$/.test(input) === false
    ) {
      // failing = true;
      returnString = "Please enter a number";
    } else if (
      parseInt(input, 10) < 1776 ||
      parseInt(input, 10) > parseInt(year, 10)
    ) {
      // Checks that the month value is within a normal range
      returnString = "Please enter a valid Year";
    }
    return returnString;
  };

  // This method checks the first month/year input range and sets any validation errors to state
  const validateStartInput = () => {
    const startErrorArray = [];

    startErrorArray.push(validateMonth(monthStart));
    startErrorArray.push(validateYear(yearStart));

    setStartErrorMessage(startErrorArray);
  };

  // This method checks the second month/year input range and sets any validation errors to state
  const validateEndInput = () => {
    const endErrorArray = [];

    endErrorArray.push(validateMonth(monthEnd));
    endErrorArray.push(validateYear(yearEnd));

    setEndErrorMessage(endErrorArray);
  };

  // This method takes all user input and sets it to state
  const handleInput = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "monthStart":
        setMonthStart(value || "");
        break;
      case "monthEnd":
        setMonthEnd(value || "");
        break;
      case "yearStart":
        setYearStart(value || "");
        break;
      case "yearEnd":
        setYearEnd(value || "");
        break;
      default:
        throw new Error(
          "Input name not supported. Unable to update date input!"
        );
    }
  };

  return (
    <div className="date-range" data-test="component-date-range">
      <div className="date-range-start">
        <span className="question-inner-header span-pdf-no-bookmark">
          {question.answer.labels[0] ? question.answer.labels[0] : "Start"}
        </span>
        <div className="ds-c-field__hint" aria-label="Date range hint">
          mm/yyyy
        </div>
        <div className="errors">
          {startErrorMessage.map((e) => {
            if (e !== undefined) {
              return <div key={crypto.randomUUID()}> {e} </div>;
            }
            return false;
          })}
        </div>
        <div className="date-range-start-wrapper">
          <TextField
            className="ds-c-field--small"
            data-test="component-daterange-monthstart"
            name="monthStart"
            numeric
            label="range start month"
            onChange={handleInput}
            onBlur={validateStartInput}
            value={monthStart}
            disabled={props.disabled}
          />
          <div className="ds-c-datefield__separator">/</div>
          <TextField
            className="ds-c-field--small"
            name="yearStart"
            label="range start year"
            onChange={handleInput}
            onBlur={validateStartInput}
            numeric
            value={yearStart}
            disabled={props.disabled}
          />
        </div>
      </div>

      <div className="date-range-start">
        <span className="question-inner-header span-pdf-no-bookmark">
          {question.answer.labels[1] ? question.answer.labels[1] : "End"}{" "}
        </span>
        <div className="ds-c-field__hint" aria-label="Date range hint">
          mm/yyyy
        </div>
        <div className="errors">
          {endErrorMessage.map((e) => {
            if (e !== undefined) {
              return <div key={crypto.randomUUID()}> {e} </div>;
            }
            return false;
          })}
        </div>

        <div className="date-range-end-wrapper">
          <TextField
            className="ds-c-field--small"
            name="monthEnd"
            numeric
            label="range end month"
            onChange={handleInput}
            onBlur={validateEndInput}
            value={monthEnd}
            disabled={props.disabled}
          />
          <div className="ds-c-datefield__separator">/</div>

          <TextField
            className="ds-c-field--small"
            name="yearEnd"
            label="range end year"
            onChange={handleInput}
            onBlur={validateEndInput}
            numeric
            value={yearEnd}
            disabled={props.disabled}
          />
        </div>
        <div className="errors">
          {endRangeErr === true ? (
            <div>End date must come after start date</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

DateRange.propTypes = {
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  year: PropTypes.string,
};

export default DateRange;
