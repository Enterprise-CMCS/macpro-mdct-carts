import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import { connect } from "react-redux";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "@reach/accordion/styles.css";
import { sliceId } from "../../Utils/helperFunctions";
import FormActions from "../../layout/FormActions";
import {
  Button as button,
  Choice,
  ChoiceList,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";

class Section3a extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emptyAttribute: ""
    };
    this.setConditional = this.setConditional.bind(this)
  }

  setConditional(el) {
    this.setState({
      [el.target.name]: el.target.value,
    });
    // el.target.defaultChecked = true;
    //this.setQuestionDisable(el.target.name, el.target.value);
  }

  componentDidMount() {
    // Nothing needed in initialize
  }

  
  render() {
    return (
      <div className="section-3a ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="section-content">
            <Tabs>
              <TabPanel
                id="tab-form"
                tab="Section 1"
              >
                <form>
                  <div>
                    <h3 className="part-header">
                      Part 3a: Program Outreach
                    </h3>
                    <div
                      className="part1-all-questions-container"
                      hidden={this.state.mchipDisable}
                    >
                      <div className="question-container">
                        <div id="p1_q1">
                          <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                            <legend className="ds-c-label">
                                1.	Have you changed your outreach methods in the last federal fiscal year?
                            </legend>

                            <ChoiceList
                              choices={[
                                {
                                  label: "Yes",
                                  value: "yes",
                                },
                                {
                                  label: "No",
                                  value: "no",
                                },
                              ]}
                              className="p1_q1"
                              label=""
                              name="p1_q1"
                              onChange={this.setConditional}
                            />
                          </fieldset>
                          {this.state.p1_q1 === "yes" ? (
                            <div className="conditional">
                              <TextField
                                label="a) What are you doing differently?"
                                name="p1_q1__a"
                                //mask="currency"
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="question-container">
                        <div id="p1_q2">
                          <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                            <legend className="ds-c-label"
                            >
                                2. Are you targeting specific populations in your outreach efforts?
                            </legend>
                            <ChoiceList
                              choices={[
                                {
                                  label: "Yes",
                                  value: "yes",
                                },
                                {
                                  label: "No",
                                  value: "no",
                                },
                              ]}
                              className="p1_q2"
                              label=""
                              name="p1_q2"
                              onChange={this.setConditional}
                              hint={"For example: minorities, immigrants, or children living in rural areas."}
                            />
                          </fieldset>
                          {this.state.p1_q2 === "yes" ? (
                            <div className="conditional">
                              <TextField
                                label="a) Have these efforts been successful? How have you measured the effectiveness of your outreach efforts?"
                                name="p1_q2__a"
                                //mask="currency"
                              />
                            </div>
                          ) : (
                            ""
                          )}
                         
                        </div>
                      </div>
                      <div className="question-container">
                        <div id="p1_q3" disabled={this.state.p1q2Disable}>
                          <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                            <TextField
                                label="3. What methods have been most effective in reaching low-income, uninsured children? "
                                name="p1_q3"
                                hint={"For example: TV, school outreach, or word of mouth."}
                              />
                          </fieldset>
                        </div>
                      </div>
                      <div className="question-container">
                        <div id="p1_q4" disabled={this.state.p1q2Disable}>
                          <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                            <legend className="ds-c-label">
                            4.	Anything else you’d like to add about your outreach efforts?
                            </legend>
                            <TextField
                                name="p1_q4"
                              />
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <FormNavigation nextUrl="/3b" previousUrl="/2b" />
              </TabPanel>
            </Tabs>
            <FormActions />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  year: state.formYear,
});

export default connect(mapStateToProps)(Section3a);
