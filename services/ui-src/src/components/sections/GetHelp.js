import React from "react";
import { Alert } from "@cmsgov/design-system";
import ContactCard from "../Utils/ContactCard";
import techIcon from "../../assets/images/noun-technical-support-1873885-D5DEE4.png";

// eslint-disable-next-line no-unused-vars
const GetHelp = ({ currentUser }) => {
  const contactDescription = <p> For technical support and login issues: </p>;
  const contactAction = (
    <p>
      <strong>
        Email <a href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</a>
      </strong>
    </p>
  );
  return (
    <main className="page-info ds-l-container">
      <div className="ds-l-col--12">
        <Alert heading="Informative status">
          <p className="ds-c-alert__text">
            Lorem ipsum dolor sit link text, consectetur adipiscing elit, sed do
            eiusmod.
          </p>
        </Alert>
        <h1>How can we help you?</h1>
        <p>
          Question or feedback? Please email us and we will respond as soon as
          possible. You can also review our frequently asked questions below.
        </p>
        <ContactCard
          icon={techIcon}
          iconAlt="Technical Contact Info Icon"
          description={contactDescription}
          action={contactAction}
        />
      </div>
    </main>
  );
};

export default GetHelp;
