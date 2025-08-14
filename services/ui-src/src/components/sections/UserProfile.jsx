import React from "react";
import { useSelector } from "react-redux";
import { Main } from "../layout/Main";

const UserProfile = () => {
  const currentUser = useSelector((state) => state.stateUser.currentUser);
  return (
    <div className="page-info ds-l-container">
      <div className="ds-l-row">
        <div className="ds-l-col--12">
          <Main className="main">
            <h1>User Profile</h1>
            If any information is incorrect, please contact the{" "}
            <a href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</a>.
            <dl className="profile-information">
              <div>
                <dt>EUA Id:</dt>
                <dd>{currentUser.username}</dd>
              </div>
              <div>
                <dt>Name:</dt>
                <dd>
                  {currentUser.firstname} {currentUser.lastname}
                </dd>
              </div>
              <div>
                <dt>Email:</dt>
                <dd>{currentUser.email}</dd>
              </div>
              <div>
                <dt>Role:</dt>
                <dd>{currentUser.role}</dd>
              </div>
            </dl>
          </Main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
