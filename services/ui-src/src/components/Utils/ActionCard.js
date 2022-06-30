import React from "react";
import PropTypes from "prop-types";

const ActionCard = ({ icon, iconAlt, children }) => {
  return (
    <div className="action-card" role="complementary">
      {icon && iconAlt && (
        <div className="action-card-img-container">
          <img className="action-card-img" src={icon} alt={iconAlt} />
        </div>
      )}
      <div className="action-card-info">{children}</div>
    </div>
  );
};

ActionCard.propTypes = {
  icon: PropTypes.string,
  iconAlt: PropTypes.string,
};

export default ActionCard;
