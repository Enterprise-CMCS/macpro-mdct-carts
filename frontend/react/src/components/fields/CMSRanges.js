import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CMSLegend from "../fields/CMSLegend";
import CMSRange from "./CMSRange";

class CMSRanges extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ranges: [
        // {
        //   id: 0,
        //   component: <><CMSRange item={this.props.item} mask="currency" numeric index="0" /><CMSRange item={this.props.item} mask="currency" numeric index="1" /></>
        // }
      ],
    };

    this.newRanges = this.newRanges.bind(this);
  }

  componentDidMount() {
    let newRanges = [];

    this.props.item.answer.range_categories.map((range, index) => {
      let header = index === 0 ? <h3>{this.props.item.answer.header}</h3> : null
      newRanges.push({
        component: <>{header}<CMSRange item={this.props.item} mask="currency" numeric index={index} /></>,
      });

    })



    this.setState({
      [`ranges`]: this.state.ranges.concat(newRanges),
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
        component: <>{header}<CMSRange item={this.props.item} mask="currency" numeric index={index} /></>,
      });

    })
    this.setState({
      [`ranges`]: this.state.ranges.concat(newRanges),
    });
  }

  render() {
    return (
      <div className="cmsranges">
        <CMSLegend
          label={this.props.item.label}
          type="subquestion"
          id={this.props.item.id}
        />

        {this.state.ranges.map(
          (input) => {
            return input.component;
          })}


        <button
          onClick={(e) => this.newRanges()}
          type="button"
          className="ds-c-button ds-c-button--primary cmsranges-btn"
        >
          Add another? <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    );
  }
}

export default CMSRanges;
