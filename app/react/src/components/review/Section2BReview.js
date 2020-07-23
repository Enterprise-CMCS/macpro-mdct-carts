import React, { Component } from "react";
import Objective2BReview from "./Section2B/Objective2BReview";
import FormNavigation from "../layout/FormNavigation";
import { Tabs, TabPanel } from "@cmsgov/design-system-core";
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
import { sliceId } from "../Utils/helperFunctions";
import FormActions from "../layout/FormActions";
import DateRange from "../layout/DateRange";

class Section2BReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectiveCount: 1,
      objectiveArray: [],
      previousObjectivesArray: [],
      pageTitle: "Section 2B: State Plan Goals and Objectives",
    };
  }

  componentDidMount() {
    let dummyDataArray = [];

    for (let i = 1; i < 3; i++) {
      dummyDataArray.push({
        id: `${this.props.year - 1}_${i}`,
        // this creates dummy data for the previous year tab, each tagged as a previous entry using props
        component: (
          <Objective2BReview
            objectiveId={`${this.props.year - 1}_${i}`}
            previousEntry="true"
          />
        ),
      });
    }

    this.setState({
      previousObjectivesArray: dummyDataArray,
    });
  }
  render() {
    return (
      <div className="section-2b ds-l-col--9 content">
        <div className="main">
          <div className="section-content">
            <h2>{this.state.pageTitle}</h2>

            <div className="section-content">
              <div className="objective-accordion">
                {/* This builds an accordion that maps through the array of prevoous Objectives in state */}
                <form>
                  <Accordion>
                    {this.state.previousObjectivesArray.map((element) => (
                      <AccordionItem key={element.id}>
                        <div className="accordion-header">
                          <h3>
                            <AccordionButton>
                              <div className="title">
                                {/* The sliceId utility function gets just the number of each objective, removes the year */}
                                {/* The first objective will have a predetermined header*/}

                                {element.component.props.objectiveHeader
                                  ? `Objective: ${element.component.props.objectiveHeader}`
                                  : `Objective ${sliceId(element.id)}:`}
                              </div>
                              <div className="arrow"></div>
                            </AccordionButton>
                          </h3>
                        </div>
                        <AccordionPanel>
                          {/* This is where the component is being rendered*/}
                          {element.component}
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </form>
                <FormNavigation
                  nextUrl="/section3/3a"
                  previousUrl="/section2/2a"
                />
              </div>
            </div>
          </div>
          <FormActions />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  year: state.global.formYear,
});

export default connect(mapStateToProps)(Section2BReview);
