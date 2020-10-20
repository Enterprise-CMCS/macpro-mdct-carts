import React, {Component} from "react";
import {selectFragment} from "../../store/formData";
import {selectQuestionsForPart} from "../../store/selectors";
import {connect} from "react-redux";

class Spinner extends Component {
  // constructor(props) {
  //   super(props)
  //
  //   if(this.props.hasOwnProperty('isFetching')) {
  //     let a = this.props.isFetching;
  //   } else {
  //     let b = this.props.isFetching;
  //   }
  //
  //   this.state = {
  //     isFetching: this.props.hasOwnProperty('isFetching') ? this.props.isFetching : false
  //     //loading: true
  //   }
  // }

  render() {
    let a = this.props.isFetching;
    return (
      this.props.isFetching ? (
      <div className="preloader">
        <h1>Proof of concept!</h1>
      </div>
      ) : null
    )
  }
}

const mapStateToProps = (state) => {
  let a = state.global.isFetching;
  return {
    isFetching: state.global.isFetching,
  };
};

export default connect(mapStateToProps)(Spinner);