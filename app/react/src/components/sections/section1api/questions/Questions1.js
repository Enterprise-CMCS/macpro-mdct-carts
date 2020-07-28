import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import FPL from "../../../layout/FPL";
import Data from "./../section1data.json";
import { Choice, ChoiceList, TextField } from "@cmsgov/design-system-core";

class Questions1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      p1_q1: "",
      p1_q1__a: "",
      p1_q2: "",
      p1_q2__a: "",
      p1_q2__a__1: "",
      p1_q3: "",
      p1_q3__b: "",
      p1_q4: "",
      p1_q4__a: "",
      p1_q5: "",
      p1_q6: "",
      p2_q1: "",
      p2_q1__a: "",
      p2_q2: "",
      p2_q2__a: "",
      p2_q2__a__1: "",
      p2_q3: "",
      p2_q4: "",
      p2_q4__a: "",
      p2_q5: "",
      p2_q6: "",
      p3_q1: "",
      p3_q2: "",
      p3_q3: "",
      p3_q4: "",
      p3_q5: "",
      ly_p1_q1: "yes",
      ly_p1_q1__a: "100.00",
      ly_p1_q2: "yes",
      ly_p1_q2__a: "no",
      ly_p1_q2__a__1: "50.00",
      ly_p1_q3: "no",
      l1_p1_q3__b: "",
      ly_p1_q4: "",
      ly_p1_q4__a: "",
      ly_p1_q5: "Managed Care Organization (MCO)",
      ly_p1_q6: "This is what you wrote last year.",
      ly_p2_q1: "no",
      ly_p2_q1__a: "",
      ly_p2_q2: "no",
      ly_p2_q2__a: "",
      ly_p2_q2__a__1: "",
      ly_p2_q3: "",
      ly_p2_q4: "",
      ly_p2_q4__a: "",
      ly_p2_q5: "Primary Care Case Management (PCCM)",
      ly_p2_q6: "This is what you wrote last year.",

      fillFormTitle: "Same as last year",

      mchipDisable: false,
      schipDisable: false,
      p1q2Disable: true,
      p2q2Disable: true,

      p3_yes: [],
      p4_yes: [],
      ly_p3_yes: [],
      ly_p4_yes: [],

      // Initialize FPL ranges
      p1_q2_fpl: [],
      p1_q2_fpl_count: 1,

      p1_q3_fpl: [],
      p1_q3_fpl_count: 1,

      p2_q2_fpl: [],
      p2_q2_fpl_count: 1,

      p2_q3_fpl: [],
      p2_q3_fpl_count: 1,
    };

    this.setConditional = this.setConditional.bind(this);
    this.setProgramDisable = this.setProgramDisable(this);
    this.setQuestionDisable = this.setQuestionDisable.bind(this);
    this.setKeyword = this.setKeyword.bind(this);
    this.newFPL = this.newFPL.bind(this);
  }

  componentDidMount() {
    // Set initial component for FPL ranges
    const initialFPL = [
      {
        id: 1,
        component: <FPL />,
      },
    ];

    this.setState({
      p1_q2_fpl: initialFPL,
      p1_q3_fpl: initialFPL,
      p2_q2_fpl: initialFPL,
      p2_q3_fpl: initialFPL,
    });
  }

  /**
   * Add new FPL component to list (state) and update state
   *
   * @param {String} list
   */
  newFPL(list) {
    let newID = this.state[list + "_count"] + 1;
    console.log("newID: ", newID);
    let newFPL = {
      id: newID,
      component: <FPL />,
    };
    this.setState({
      [`${list}_count`]: newID,
      [`${list}`]: this.state[list].concat(newFPL),
    });
  }
  /**
   * Add/remove keyword from display array
   *
   * @param {String} part
   * @param {Element} el
   */
  setKeyword(part, el) {
    let name = el.target.name;
    let p3Yes = this.state.p3_yes;
    let p4Yes = this.state.p4_yes;

    // If answer is yes, add name
    if (el.target.value === "yes") {
      if (part === "p3") {
        this.setState({
          p3_yes: this.state.p3_yes.concat(name),
        });
      } else {
        this.setState({
          p4_yes: this.state.p4_yes.concat(name),
        });
      }
      // If answer is NOT yes, remove name from array
    } else {
      if (part === "p3") {
        // Find array index based on value
        let index = p3Yes.indexOf(name);

        // Remove array item by index id
        if (index !== -1) {
          p3Yes.splice(index, 1);
        }

        // Reset state with new array
        this.setState({ p3_yes: p3Yes });
      } else {
        // Find array index based on value
        let index = p4Yes.indexOf(name);

        // Remove array item by index id
        if (index !== -1) p4Yes.splice(index, 1);

        // Reset state with new array
        this.setState({ p4_yes: p4Yes });
      }
    }
  }

  /**
   * If conditional value is triggered, set state to value
   * @param {Event} el
   */
  setConditional(el) {
    this.setState({
      [el.target.name]: el.target.value,
    });
    // el.target.defaultChecked = true;
    this.setQuestionDisable(el.target.name, el.target.value);
  }

  //set the flags for the custom div property disabled (_layout.scss) based on the selected programType
  //true means the section will be disabled
  //false means the section will be enabled
  setProgramDisable() {
    {
      this.props.programType === "mCHIP"
        ? (this.state.mchipDisable = true)
        : (this.statemchipDisable = false);
    }
    {
      this.props.programType === "sCHIP"
        ? (this.state.schipDisable = true)
        : (this.stateschipDisable = false);
    }
  }

  //set the flags for the custom div property disabled (_layout.scss) based on the selected programType
  //true means the section will be disabled
  //false means the section will be enabled
  setQuestionDisable(ename, evalue) {
    //Each question must have its own disable variable in state
    //The disable variable should only be changed IF we are working with the appropriate question
    if (ename === "p1_q2") {
      evalue === "yes"
        ? this.setState({ p1q2Disable: false })
        : this.setState({ p1q2Disable: true });
    }
    if (ename === "p2_q2") {
      evalue === "yes"
        ? this.setState({ p2q2Disable: false })
        : this.setState({ p2q2Disable: true });
    }
  }

  render() {
    return (
      <form>
        {this.setProgramDisable}
        {this.setQuestionDisable}

        {/* Begin parsing through parts */}
        {Data.parts.map((part) => (
          <div>
            <h3>{part.header}</h3>

            {/* Begin parsing through top level questions */}
            {part.questions.map((question) => (
              <fieldset className="ds-c-fieldset">
                <legend className="ds-c-label">{question.text}</legend>

                {/* If radio button */}
                {question.answer_type === "multi"
                  ? question.answer_values.map((value) => (
                      <div>
                        <Choice
                          class="ds-c-choice"
                          name={question.id}
                          value={value}
                          type="radio"
                          name={question.id}
                          {...(question.conditional === "2020-01-01-01 is yes"
                            ? { checked: "checked" }
                            : { checked: "checked" })}
                        >
                          {question.text}
                        </Choice>
                      </div>
                    ))
                  : null}
                {/* If textarea */}
                {question.answer_type === "text_long" ? (
                  <div>
                    <textarea
                      class="ds-c-field"
                      name={question.id}
                      value={question.answer}
                      type="text"
                      name={question.id}
                      rows="6"
                    />
                  </div>
                ) : null}
              </fieldset>
            ))}
          </div>
        ))}
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  programType: state.programType,
  year: state.formYear,
});

export default connect(mapStateToProps)(Questions1);
