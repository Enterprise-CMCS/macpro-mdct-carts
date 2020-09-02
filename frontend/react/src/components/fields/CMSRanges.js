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
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    let newRanges = [];

    this.props.item.answer.range_categories.map((range, index) => {
      let header = index === 0 ? <h3>{this.props.item.answer.header}</h3> : null
      newRanges.push({
        id: 0,
        component: <>{header}<CMSRange item={this.props.item} mask="currency" numeric index={index} counter={this.state.rangesId} onChange={this.onChange} /></>,
      });

    })

    this.setState({
      [`ranges`]: this.state.ranges.concat(newRanges),
      [`rangesId`]: this.state.rangesId + 1,
    });
  }

  onChange(evt) {

    // Use callback for additional processing
    this.setState({ [evt[0]]: evt[1] }, () => {

      // Get all state items
      let currentState = this.state;

      let rangesArray = [];

      // Loop through all state items
      for (const [key, value] of Object.entries(currentState)) {
        let chunks = key.split("-");

        // get all range values from state
        if (chunks[0] === "range") {
          rangesArray.push([key, value]);
        }
      }
      // sort array alphabetically
      rangesArray.sort();

      let parentArray = [];

      // Loop through all ranges
      for (let i = 0; i < rangesArray.length; i++) {
        let tempArray = [];

        // Loop through all ranges again
        for (let j = 0; j < rangesArray.length; j++) {

          // Get current iteration from state name
          let rangeId = rangesArray[j][0].split("-")[1]; //range-0-1-a : returns 0

          // If current iteration matches chunk from state name
          if (Number(i) === Number(rangeId)) {
            let tempSubArray = [];
            // if new row, create array
            for (let k = 0; k < rangesArray.length; k++) {

              let row = rangesArray[k][0].split("-")[2]; //range-0-1-a : returns 1

              if (Number(j) === Number(row)) {
                tempSubArray.push(rangesArray[k][1]);
              }
            }

            if (tempSubArray.length > 0) {
              tempArray.push(tempSubArray);
            }
          }

        }

        // If temparray has values, add to parent array
        if (tempArray.length > 0) {
          parentArray.push(tempArray);
        }
      }

      this.setState({ [this.props.item.id]: parentArray })

      // Pass up to parent component
      this.props.onChange([this.props.item.id, parentArray]);
    })
  }

  /**
   * Add new Range component to list (state) and update state
   *
   */
  newRanges() {
    let newRanges = [];

    // Loop through available options in range_categories
    this.props.item.answer.range_categories.map((range, index) => {

      // Add header, if available
      let header = index === 0 ? <h3>{this.props.item.answer.header}</h3> : null

      // Add new component to view array
      newRanges.push({
        id: this.state.rangesId,
        component: <>{header}<CMSRange item={this.props.item} mask="currency" numeric index={index} counter={this.state.rangesId} onChange={this.onChange} /></>,
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
