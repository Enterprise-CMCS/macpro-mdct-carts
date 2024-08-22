import { useSelector } from "react-redux";
import { AppRoles } from "types";

const StateHeader = () => {
  const { currentUser, name, imageURI } = useSelector(
    (state) => state.stateUser
  );
  return (
    <>
      {currentUser.role === AppRoles.STATE_USER && (
        <div
          className="state-header"
          data-testid="state-header"
          aria-label="State Header"
        >
          <div className="state-image">
            <img src={imageURI} alt={name} />
          </div>
          <div className="state-name">{name}</div>
        </div>
      )}
    </>
  );
};

export default StateHeader;
