import React, { Component } from "react";
import { connect } from "react-redux";

class StateHeader extends Component {
  render() {
    return (
      <div className="state-header">
        <div className="state-image">
          <img src={this.props.imageURI} alt={this.props.name} />
        </div>
        <div className="state-name">{this.props.name}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  imageURI: state.stateUser.imageURI,
});

export default connect(mapStateToProps)(StateHeader);
