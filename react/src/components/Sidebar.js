import React, {Component} from 'react';
import StateHeader from "./StateHeader";
import TOC from "./TOC";

class Sidebar extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div class="sidebar" >

                <StateHeader stateInfo={this.props.stateInfo} />
                <TOC />
            < /div>
    )
    }
}

export default Sidebar;