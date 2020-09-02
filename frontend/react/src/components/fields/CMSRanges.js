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
      let header =
        index === 0 ? <h3>{this.props.item.answer.header}</h3> : null;
      newRanges.push({
        id: 0,
        component: (
          <>
            {header}
            <CMSRange
              item={this.props.item}
              mask="currency"
              numeric
              index={index}
              counter={this.state.rangesId}
              onChange={this.onChange}
            />
          </>
        ),
      });
    });

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

      let parentObj = {};

      // Ranges array:
      // // [
      // 0: (2) ["range-0-0-a", "1"]
      // 1: (2) ["range-0-0-b", "2"]

      // 2: (2) ["range-0-1-a", "3"]
      // 3: (2) ["range-0-1-b", "4"]

      // 4: (2) ["range-1-0-a", "5"]
      // 5: (2) ["range-1-0-b", "6"]
      // 6: (2) ["range-1-1-a", "7"]
      // 7: (2) ["range-1-1-b", "8"]
      // // ]

      // Parent Object
      // {
      // 0: [[1,2], [3,4]]
      // 1: [[5,6], [7,8]]
      // }

      for (let i = 0; i < rangesArray.length; i++) {
        let rangeId = rangesArray[i][0].split("-")[1]; //range-0-1-a : returns 0
        let rowId = rangesArray[i][0].split("-")[2]; //range-0-1-a : returns 1

        // filter out matching pairs
        let matchingInput = rangesArray.filter(function (element) {
          return (
            element[0].split("-")[1] === rangeId &&
            element[0].split("-")[2] === rowId
          );
        }); // all of the inputs that have the same 2nd & 3rd characters, pairing the a'S & B's

        if (matchingInput.length > 1) {
          // pull out the values from the matching pairs (if they're both present)
          let pair = [matchingInput[0][1], matchingInput[1][1]];

          // if this rangeID already exists in the parent object, add to that array
          if (parentObj[rangeId]) {
            parentObj[rangeId].push(pair);
          } else {
            // if this rangeID does not exist in the parent object, create a new array and add to it
            parentObj[rangeId] = [pair];
          }
          i++;
        }
      }

      // extract the values from all of the keys in the parent object (one array per rangeID)
      // spread them into one greater array
      let nestedArray = [...Object.values(parentObj)];

      console.log("Final nested array????", nestedArray);
      // let parentArray = [];

      // // Loop through all ranges
      // for (let i = 0; i < rangesArray.length; i++) {
      //   let tempArray = [];

      //   // Loop through all ranges again
      //   for (let j = 0; j < rangesArray.length; j++) {

      //     // Get current iteration from state name
      //     let rangeId = rangesArray[j][0].split("-")[1]; //range-0-1-a : returns 0

      //     // If current iteration matches chunk from state name
      //     if (Number(i) === Number(rangeId)) {
      //       let tempSubArray = [];
      //       // if new row, create array
      //       for (let k = 0; k < rangesArray.length; k++) {

      //         let row = rangesArray[k][0].split("-")[2]; //range-0-1-a : returns 1

      //         if (Number(j) === Number(row)) {
      //           tempSubArray.push(rangesArray[k][1]);
      //         }
      //       }

      //       if (tempSubArray.length > 0) {
      //         tempArray.push(tempSubArray);
      //       }
      //     }

      //   }

      //   // If temparray has values, add to parent array
      //   if (tempArray.length > 0) {
      //     parentArray.push(tempArray);
      //   }
      // }

      this.setState({ [this.props.item.id]: nestedArray });

      // Pass up to parent component
      // this.props.onChange([this.props.item.id, parentArray]);
    });
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
      let header =
        index === 0 ? <h3>{this.props.item.answer.header}</h3> : null;

      // Add new component to view array
      newRanges.push({
        id: this.state.rangesId,
        component: (
          <>
            {header}
            <CMSRange
              item={this.props.item}
              mask="currency"
              numeric
              index={index}
              counter={this.state.rangesId}
              onChange={this.onChange}
            />
          </>
        ),
      });
    });

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
        {this.state.ranges.map((input) => {
          return input.component;
        })}

        <button
          onClick={(e) => this.newRanges()}
          type="button"
          className="ds-c-button ds-c-button--primary cmsranges-btn"
        >
          Add another? <FontAwesomeIcon icon={faPlus} />
        </button>

        <button
          onClick={(e) =>
            this.removeRanges(this.props.item.answer.range_categories.length)
          }
          type="button"
          className="ds-c-button ds-c-button--primary cmsranges-btn cmsranges-remove"
        >
          Remove Last Entry <FontAwesomeIcon icon={faMinusCircle} />
        </button>
      </div>
    );
  }
}

export default CMSRanges;
