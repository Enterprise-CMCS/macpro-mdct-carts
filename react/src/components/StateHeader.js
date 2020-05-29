import React, {Component} from 'react';

class StateHeader extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="state-header">
                <div class="state-image">
                <img src={this.props.stateInfo.imageUri} alt={this.props.stateInfo.name} />
            </div>
            <div class="state-name">
                {this.props.stateInfo.name}
                </div>
            </div>
        )
    }
}

export default StateHeader;