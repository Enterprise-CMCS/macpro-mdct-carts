import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Question from "./Question";
import { connect } from "react-redux";
import axios from "../../authenticatedAxios";

const DataGrid = ({ question, state }) => {
  const [renderQuestions, setRenderQuestions] = useState([]);
  const [questionsToSet, setQuestionsToSet] = useState([]);

  const rowStyle =
    question.questions.length > 5
      ? `subquestion ds-u-padding-left--2`
      : `ds-u-margin-top--0`;

  // Pull data from last year
  const getDataFromLastYear = async (item) => {
    if (!item.id || !Array.isArray(questionsToSet)) {
      return;
    }

    // Split and create array from id
    const splitID = item.id.split("-");

    // Get last year value (e.g. 2019) from splitID
    const lastYear = parseInt(splitID[0]) - 1;

    // the subquestion id (a, b, c, etc)
    const questionId = splitID[5];

    // Even years get inputs, odd years get previous year data
    const shouldGetPriorYear = splitID[0] % 2;

    if (
      shouldGetPriorYear &&
      splitID[1] === "03" &&
      splitID[2] === "c" &&
      splitID[3] === "06" &&
      parseInt(splitID[4]) > 2 &&
      parseInt(splitID[4]) < 10
    ) {
      // Set year to last year
      splitID[0] = parseInt(splitID[0]) - 1;
      splitID.pop();
      const fieldsetId = splitID.join("-");

      await axios
        .get(`/api/v1/sections/${lastYear}/${state.toUpperCase()}/3`)
        .then((data) => {
          // If data exists, decipher value from return result (data)
          if (data) {
            let prevYearValue =
              parseInt(
                getValueFromLastYear(data.data, fieldsetId, questionId)
              ) || "";

            // Add new entry to questionsToSet Array
            const temp = questionsToSet.push({
              hideNumber: true,
              question: item,
              prevYear: { value: prevYearValue, disabled: true },
            });

            // Set cumulative array of questions to local state
            setQuestionsToSet(temp);
          }
        });
    } else {
      // Add values to render array
      const temp = questionsToSet.push({
        hideNumber: true,
        question: item,
      });

      setQuestionsToSet(temp);
    }

    // Don't add empty arrays
    if (questionsToSet.length > 0) {
      setRenderQuestions(questionsToSet);
    }
  };

  // Takes in a section, fieldset ID, and item id to determine which value matches from larger data set
  const getValueFromLastYear = (data, fieldsetId, itemId) => {
    let lastYearAnswer;

    // Get questions from last years JSON
    const questions = data.contents.section.subsections[2].parts[5].questions;

    // Filter down to specific question
    let matchingQuestion = questions.filter(
      (question) => fieldsetId === question?.fieldset_info?.id
    );

    // The first will always be correct
    if (matchingQuestion[0]) {
      // Since these always go in order we get the subquestion ID, convert to lowercase letter, get the char code (a = 97)
      // and subtract 97 to get the question index number
      const index = itemId.toLowerCase().charCodeAt(0) - 97;
      lastYearAnswer =
        matchingQuestion[0].questions[1].questions[index].answer.entry;
    }
    return lastYearAnswer ?? null;
  };

  useEffect(() => {
    const generateRenderQuestions = () => {
      // Loop through all questions (passed in)
      question.questions.map(async (item) => {
        await getDataFromLastYear(item);
      });
    };

    generateRenderQuestions();
  }, []);

  return renderQuestions.length ? (
    <div className={`ds-l-row input-grid__group ${rowStyle}`}>
      {renderQuestions.map((question, index) => {
        return (
          <div className="ds-l-col" key={index}>
            <Question
              hideNumber={question.type !== "fieldset"}
              question={question.question}
              prevYear={question.prevYear}
            />
          </div>
        );
      })}
    </div>
  ) : null;
};

DataGrid.propTypes = {
  question: PropTypes.object.isRequired,
  year: PropTypes.number.isRequired,
  state: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  year: state.formData[0].contents.section.year,
  state: state.formData[0].contents.section.state,
});

export default connect(mapStateToProps)(DataGrid);
