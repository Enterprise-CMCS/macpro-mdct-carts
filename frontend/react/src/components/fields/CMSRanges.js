import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import CMSLegend from "../fields/CMSLegend";
import CMSRange from "./CMSRange";

class CMSRanges extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ranges: [],
      rangesId: 0,
    };

    this.newRanges = this.newRanges.bind(this);
    this.removeRanges = this.removeRanges.bind(this);
  }

  componentDidMount() {
    let newRanges = [];

    this.props.item.answer.range_categories.map((range, index) => {
      let header = index === 0 ? <h3>{this.props.item.answer.header}</h3> : null
      newRanges.push({
        id: 0,
        component: <>{header}<CMSRange item={this.props.item} mask="currency" numeric index={index} /></>,
      });

    })

    this.setState({
      [`ranges`]: this.state.ranges.concat(newRanges),
      [`rangesId`]: this.state.rangesId + 1,
    });
  }

  /**
   * Add new Range component to list (state) and update state
   *
   */
  newRanges() {
    let newRanges = [];
    this.props.item.answer.range_categories.map((range, index) => {
      let header = index === 0 ? <h3>{this.props.item.answer.header}</h3> : null
      newRanges.push({
        id: this.state.rangesId,
        component: <>{header}<CMSRange item={this.props.item} mask="currency" numeric index={index} /></>,
      });

    })
    this.setState({
      [`ranges`]: this.state.ranges.concat(newRanges),
      [`rangesId`]: this.state.rangesId + 1,
    });
  }

  /**
   * Remove last ranges
   */
  removeRanges(count) {

    // Pull ranges from state and spread
    const ranges = [...this.state.ranges];

    // Remove last inputs based on how many are needed to be removed
    for (let i = 0; i < count; i++) {
      ranges.pop();
    }

    // Reset state with less ranges components
    this.setState({ ranges: ranges });
  }

  render() {
    return (
      <div className="cmsranges">
        {/* {alert(this.state.ranges)} */}
        <CMSLegend
          label={this.props.item.label}
          type="subquestion"
          id={this.props.item.id}
        />


        {this.state.ranges.map(
          (input) => {
            return (
              input.component
            )
          }
        )}


        <button
          onClick={(e) => this.newRanges()}
          type="button"
          className="ds-c-button ds-c-button--primary cmsranges-btn"
        >
          Add another? <FontAwesomeIcon icon={faPlus} />
        </button>

        <button
          onClick={(e) => this.removeRanges(this.props.item.answer.range_categories.length)}
          type="button"
          className="ds-c-button ds-c-button--primary cmsranges-btn cmsranges-remove">
          Remove Last Entry <FontAwesomeIcon icon={faMinusCircle} />
        </button>
      </div>
    );
  }
}

export default CMSRanges;
