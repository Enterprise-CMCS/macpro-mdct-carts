import React from "react";
import PropTypes from "prop-types";

const ContactCard = ({ icon, iconAlt, description, action }) => {
  return (
    <div className="contact-card">
      <div className="contact-card-img">
        <img src={icon} alt={iconAlt} />
      </div>
      <div className="contact-card-info">
        {description}
        {action}
      </div>
    </div>
  );
};

ContactCard.propTypes = {
  icon: PropTypes.string.isRequired,
  iconAlt: PropTypes.string.isRequired,
  description: PropTypes.element.isRequired,
  action: PropTypes.string.isRequired,
};

export default ContactCard;
