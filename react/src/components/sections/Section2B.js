import React, {Component} from 'react';
import Sidebar from "../Sidebar";

class Section2b extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stateInfo:  {
                name: 'New York',
                imageUri: process.env.PUBLIC_URL + '/img/new-york-temp.png',
            },

        }
    }
    render() {


        return (
            <div class="section-2b">
                <div class="sidebar">
                <Sidebar stateInfo={this.state.stateInfo} />
            </div>

            <div class="main">
                Section 2B Starts here
            </div>
            </div>
        )
    }
}

export default Section2b;