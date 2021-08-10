import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "@cmsgov/design-system-core";
import ReactHtmlParser from "react-html-parser";
import axios from "../../authenticatedAxios";

const Text = ({ question, ...props }) => {
  let a;
  const [printValue, setPrintValue] = useState(
    (question.answer && question.answer.entry) || ""
  );
  const [prevYearValue, setPrevYearValue] = useState();
  const [prevYearDisabled, setPrevYearDisabled] = useState();

  const updatePrintHelper = ({ target: { value } }) => {
    const val = value.replace(/\n/g, "<br/>");
    setPrintValue(val);
  };

  useEffect(() => {
    const getPrevYearValue = async () => {
      // Create array from id
      const splitID = question.id.split("-");

      // Even years get inputs, odd years get previous year data
      const shouldGetPriorYear = splitID[0] % 2;
      let a = question.id;
      let b;
      if (
        !shouldGetPriorYear &&
        splitID[1] === "03" &&
        splitID[2] === "c" &&
        splitID[3] === "06" &&
        splitID[4] === "09"
      ) {
        setPrevYearDisabled(true);
        // Set year to last year
        const lastYear = parseInt(splitID[0]) - 1;
        splitID[0] = lastYear;
        const fieldsetId = splitID.join("-");

        const state = "AK";

        await axios
          .get(`/api/v1/sections/${lastYear}/${state.toUpperCase()}/3`)
          .then((data) => {
            console.log("zzzData", data);
            let a;
            // getDataFromLastYear(fieldsetId);
            if (data) {
              let value = getValueFromLastYear(data.data, fieldsetId) || "";
              let p;
              setPrevYearValue(value);
            }
          });
      }
    };

    const getValueFromLastYear = (data, fieldsetId) => {
      let lastYearAnswer;
      // Get questions from last years JSON
      const questions = data.contents.section.subsections[2].parts[5].questions;
      let a;
      let matchingQuestion = questions.filter(
        (question) => fieldsetId === question?.id
      );
      let b;
      if (matchingQuestion[0]) {
        // Since these always go in order we get the subquestion ID, convert to lowercase letter, get the char code (a = 97)
        // and subtract 97 to get the question index number

        let c;
        lastYearAnswer = matchingQuestion[0].answer.entry;
      }
      let d;
      return lastYearAnswer ?? 0;
    };

    getPrevYearValue().then();
  }, []);

  return (
    <>
      <div className="print-helper">{ReactHtmlParser(printValue)}</div>
      <TextField
        value={
          prevYearValue || (question.answer && question.answer.entry) || ""
        }
        type="text"
        label=""
        onBlur={updatePrintHelper}
        {...props}
        disabled={prevYearDisabled}
      />
    </>
  );
};
Text.propTypes = {
  question: PropTypes.object.isRequired,
};

const TextMedium = ({ question, ...props }) => (
  <Text question={question} multiline rows={3} {...props} />
);
TextMedium.propTypes = {
  question: PropTypes.object.isRequired,
};

const TextMultiline = ({ question, ...props }) => (
  <Text question={question} multiline rows={6} {...props} />
);
TextMultiline.propTypes = {
  question: PropTypes.object.isRequired,
};

export { Text, TextMedium, TextMultiline, Text as TextSmall };
