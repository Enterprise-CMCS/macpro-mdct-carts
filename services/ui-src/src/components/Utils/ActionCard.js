import React from "react";
import PropTypes from "prop-types";

const ActionCard = ({ icon, iconAlt, children }) => {
  return (
    <div className="contact-card">
      <div className="contact-card-img">
        <img src={icon} alt={iconAlt} />
      </div>
      <div className="contact-card-info">{children}</div>
    </div>
  );
};

ActionCard.propTypes = {
  icon: PropTypes.string.isRequired,
  iconAlt: PropTypes.string.isRequired,
};

export default ActionCard;
