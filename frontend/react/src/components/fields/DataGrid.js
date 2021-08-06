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

  useEffect(() => {
    const generateRenderQuestions = () => {
      const questionsToSet = [];

      question.questions.map(async (item) => {
        // If there is no id, exit
        if (!item.id) {
          return;
        }
        // Get questionID
        const id = item.id.split("-");

        const prevYearValue = await getValueFromLastYear(
          id,
          year,
          state
        ).then();
        console.log("zzzprevYearValue", prevYearValue);

        questionsToSet.push({
          hideNumber: item.type !== "fieldset",
          question: item,
          prevYearValue,
        });
      });

      console.log("zzzQuestionsToSet", questionsToSet);
      setRenderQuestions(questionsToSet);
    };
    generateRenderQuestions();
  }, []);
  const getValueFromLastYear = async (id) => {
    if (
      id[1] !== "03" ||
      id[2] !== "c" ||
      id[3] !== "06" ||
      parseInt(id[4]) < 3 ||
      parseInt(id[4]) > 9
    ) {
      console.log("If Check - Passed");
      return;
    }
    console.log("If Check - failed");

    id[0] = parseInt(id[0]) - 1;
    const lastYearId = id.join("-");
    id.pop();
    const fieldsetId = id.join("-");

    let lastYearAnswer;
    let { data } = await axios.get(`/api/v1/sections/2019/AK/3`);
    // Get section 3c part 6
    const questions = data.contents.section.subsections[2].parts[5].questions;

    let matchingQuestion = questions.filter(
      (question) => fieldsetId === question?.fieldset_info?.id
    );
    if (matchingQuestion[0])
      lastYearAnswer = matchingQuestion[0].questions[0].answer.entry;

    // If no value, send true
    return lastYearAnswer;
  };

  return renderQuestions.length ? (
    <div className={`ds-l-row input-grid__group ${rowStyle}`}>
      {console.log("zzzRenderQuetsions", renderQuestions)}
      {renderQuestions.map((item, index) => {
        return (
          <div className="ds-l-col" key={index}>
            {console.log("renderQuestionsWorking")}
            <h1>Test</h1>
            <Question hideNumber={item.hideNumber} question={item.question} />
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
