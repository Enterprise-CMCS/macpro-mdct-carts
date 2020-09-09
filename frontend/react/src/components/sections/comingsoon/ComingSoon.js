import React, { Component } from "react";

class ComingSoon extends Component {

    render() {
        return (
            <div className="comingsoon ds-l-container">
                <div className="ds-l-row ds-u-padding-left--2">
                    <h1 className="page-title ds-u-margin-bottom--0">Coming Soon</h1>
                    <div>
                        CARTS is in the process of moving to its new address and will be temporarily unabailable
                        while we complete our move. <br />
                        Please remember to bookmark the new site and check back for updates!
                    </div>

                    <h4>Notifications will be sent to users to join CARTS once the site is made available.</h4>

                    <div>
                        Historical CARTS reports will be available for your reference.
                    </div>
                    <div>
                        If you have any questions or need assistance during our move, please contact the <a href="mailto:cartshelp@cms.hhs.gov">CARTS Help Desk</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ComingSoon;
