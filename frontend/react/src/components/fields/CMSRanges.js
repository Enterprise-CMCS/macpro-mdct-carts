import React, { Component } from "react";
import CMSLegend from "../fields/CMSLegend";
import CMSRange from "./CMSRange";

class CMSRanges extends Component {

  render() {
    return (
      <div className="cmsranges">
        <CMSLegend
          label={this.props.item.label}
          type="subquestion"
          id={this.props.item.id}
        />

        {this.props.item.answer.range_categories.map((range, index) => (
          <CMSRange item={this.props.item} mask="currency" numeric index={index} />
        ))}
      </div>
    );
  }
}

export default CMSRanges;
