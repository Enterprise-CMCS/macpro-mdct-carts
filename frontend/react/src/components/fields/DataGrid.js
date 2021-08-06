import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Question from "./Question";
import { connect } from "react-redux";
import axios from "../../authenticatedAxios";

const DataGrid = ({ question, year, state }) => {
  const [renderQuestions, setRenderQuestions] = useState([]);

  const rowStyle =
    question.questions.length > 5
      ? `subquestion ds-u-padding-left--2`
      : `ds-u-margin-top--0`;

  const getDataFromLastYear = async () => {
    const { data } = await axios.get(`/api/v1/sections/2019/AK/3`);
    return data;
  };

  useEffect(() => {
    const generateRenderQuestions = () => {
      const questionsToSet = [];

      // Loop through all questions (passed in)
      question.questions.map(async (item) => {
        // If there is no id, exit
        if (!item.id) {
          return item;
        }
        const splitID = item.id.split("-");

        if (
          splitID[1] === "03" &&
          splitID[2] === "c" &&
          splitID[3] === "06" &&
          parseInt(splitID[4]) > 2 &&
          parseInt(splitID[4]) < 10
        ) {
          // Set year to last year
          splitID[0] = parseInt(splitID[0]) - 1;
          const lastYearId = splitID.join("-");
          splitID.pop();
          const fieldsetId = splitID.join("-");

          let lastYearAnswer;
          let data = await getDataFromLastYear();
          let prevYearValue = await getValueFromLastYear(data, fieldsetId);
          // let prevYearValue = 22;
          console.log("prevYearValue", prevYearValue);

          questionsToSet.push({
            hideNumber: true,
            question: item,
            prevYearValue: parseInt(prevYearValue),
          });
        } else {
          // Add values to render array
          questionsToSet.push({
            hideNumber: true,
            question: item,
          });
        }

        return item;
      });

      // Save new questions to local state
      setRenderQuestions(questionsToSet);
    };
    generateRenderQuestions();
  }, []);
  const getValueFromLastYear = async (data, fieldsetId) => {
    let lastYearAnswer;
    const questions = data.contents.section.subsections[2].parts[5].questions;

    let matchingQuestion = questions.filter(
      (question) => fieldsetId === question?.fieldset_info?.id
    );

    if (matchingQuestion[0])
      // REVIEW FOR ACCURACY
      lastYearAnswer = matchingQuestion[0].questions[0].answer.entry;

    // console.log("zzzLastYearAnswer", lastYearAnswer ?? 0);
    return lastYearAnswer ?? 0;
  };

  return renderQuestions.length ? (
    <div className={`ds-l-row input-grid__group ${rowStyle}`}>
      {/*{console.log("zzzRenderQuestions", renderQuestions)}*/}
      {renderQuestions.map((question, index) => {
        return (
          <div className="ds-l-col" key={index}>
            {/*{console.log("zzzquestion.question", question)}*/}
            <Question
              hideNumber={question.hideNumber}
              question={question.question}
              prevYearValue={question.prevYearValue}
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
