import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import FPL from "../../../layout/FPL";
import CMSChoice from "../../../fields/CMSChoice";
import CMSLegend from "../../../fields/CMSLegend";
import FillForm from "../../../layout/FillForm";
import Data from "../backend-json-section-0.json";
import {TextField} from "@cmsgov/design-system-core";

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);
  
const validTelephoneRegex = RegExp(
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
);

class QuestionsBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {
        email: "",
        phone: "",
      },
      fillFormTitle: "Same as last year"
    };

    this.handleChange = this.handleChange.bind(this)
    this.loadAnswers = this.loadAnswers.bind(this)
  }

  handleChange(evt) {
    // this.setState({
    //   [evt.target.name]: evt.target.value,
    // });

    //Inline validation/error messaging for email and phone
    let errors = this.state.errors;

    switch (evt.target.type) {
      case "email":
        errors.email = validEmailRegex.test(evt.target.value)
          ? ""
          : "Please enter a valid email";
        break;
      case "phone_number":
        errors.phone = validTelephoneRegex.test(evt.target.value)
          ? ""
          : "Please enter a valid 10 digit phone number";
        break;
      default:
        break;
    }
  }

  loadAnswers(el) {
    el.preventDefault();
    // button title: Undo or Same as Last year
    //el.target.title = this.state.fillFormTitle;

    el.target.classList.toggle("active");

    // Boolean, Set values on active
    let isActive = el.target.classList.contains("active");

    const elementName = el.target.name;
    //This dynamically updates the element with last years response. Need to figure out a way to get all sub elements
    if (el.target.type === "textField")
    {
        var newstate = {}; 
        newstate[el.target.id] = el.target.id; 
        if(el.target.title === "Undo")
        {
            
            this.setState({ [el.target.name]: this.state[el.target.name + 'temp']})
            el.target.title = "Active";
        }
        else{
            this.setState({ [el.target.name + 'temp']: this.state[el.target.name] })
            this.setState({ [el.target.name]: this.state['previous_'+el.target.name] })
            el.target.title = "Undo";
        }
        
        this.setState(newstate);
    }  
  }

  render() {
   // Get state program 
   const stateProgram = Data.section.programType;

   return(
    <form>
     {/* Begin parsing through subsection */}
     {Data.section.subsections.map((subsections) => (
       <div className="section">
         {/* Begin parsing through parts */}
         {subsections.parts.map((part) => (
           <div className="part">
             <h3 className="part-title">{part.title}</h3>
             <h3 className="part-text">{part.text}</h3>

             {/* Determine if question should be shown */}
               {part.questions.map((question) => (
                 <div className="question">
                   <fieldset className="ds-c-fieldset">
                    <CMSLegend label={question.label} id={question.id} />

                    {question.type === "radio" ||
                    question.type === "checkbox"
                    ? Object.entries(question.answer.options).map(
                      (key, index) => {
                        return (
                          <CMSChoice
                            name={question.id}
                            value={key[1]}
                            label={key[0]}
                            type={question.type}
                            answer={question.answer.entry}
                            conditional={question.conditional}
                            children={question.questions}
                            valueFromParent={this.state[question.id]}
                            onChange={this.handleChange}
                            disabled={question.answer.readonly}
                          />
                        );
                       }
                      ) : null}

                      {question.type === "text" ? (
                       <div>
                         <TextField
                           class="ds-c-field"
                           name={question.id}
                           value={question.answer.entry}
                           type="text"
                           onChange={this.handleChange}
                           disabled={question.answer.readonly}
                         />
                       </div>
                     ) : null}

                     {question.type === "text_medium" ? (
                       <div>
                         <TextField
                           class="ds-c-field"
                           name={question.id}
                           value={question.answer.entry}
                           hint={question.hint}
                           type="text"
                           multiline
                           rows="3"
                           onChange={this.handleChange}
                           disabled={question.answer.readonly}
                         />
                       </div>
                     ) : null}

                     {question.type === "text_long" ? (
                       <div>
                         <TextField
                           class="ds-c-field"
                           name={question.id}
                           value={question.answer.entry}
                           hint={question.hint}
                           type="text"
                           multiline
                           rows="6"
                           onChange={this.handleChange}
                           disabled={question.answer.readonly}
                         />
                       </div>
                     ) : null}

                     {question.type === "mailing_address" ? (
                       <div>
                         <TextField
                           class="ds-c-field"
                           name={question.id}
                           value={question.answer.entry}
                           hint={question.hint}
                           type="text"
                           multiline
                           rows="6"
                           onChange={this.handleChange}
                         />
                       </div>
                     ) : null}

                     {question.type === "email" ? (
                       <div>
                         <TextField
                           class="ds-c-field"
                           name={question.id}
                           value={question.answer.entry}
                           type="email"
                           onChange={this.handleChange}
                         />
                       </div>
                     ) : null}

                     {question.type === "phone_number" ? (
                       <div>
                         <TextField
                           class="ds-c-field"
                           name={question.id}
                           value={question.answer.entry}
                           type="phone_number"
                           onChange={this.handleChange}
                         />
                       </div>
                     ) : null}

                     {/* If FPL Range */}
                     {question.type === "ranges" ? (
                       <div>
                         <FPL label={question.label} />
                       </div>
                     ) : null}
                   </fieldset>
                 </div>
               ))
               }
            <div>
              <a href="mailto:cartshelp@cms.hhs.gov">
                {part.helpdesk}
              </a>
            </div>
           </div>
         ))}
       </div>
     ))} 
    </form>
   )
  }
}

const mapStateToProps = (state) => ({
  abbr: state.stateUser.currentUser.state.id,
  year: state.global.formYear,
  programType: state.stateUser.programType,
  programName: state.stateUser.programName,
});

export default connect(mapStateToProps)(QuestionsBasicInfo);
