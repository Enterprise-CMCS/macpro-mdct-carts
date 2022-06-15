import React from "react";
import { Accordion, AccordionItem, Alert } from "@cmsgov/design-system";
import techIcon from "../../assets/images/noun-technical-support-1873885-D5DEE4.png";
import ActionCard from "../Utils/ActionCard";

// eslint-disable-next-line no-unused-vars
const GetHelp = ({ currentUser }) => {
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
        <ActionCard icon={techIcon} iconAlt="Technical Contact Info Icon">
          <p> For technical support and login issues: </p>
          <p>
            <strong>
              Email{" "}
              <a href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</a>
            </strong>
          </p>
        </ActionCard>

        <Accordion bordered>
          <AccordionItem heading="First FAQ Question" contentClassName="jimmy">
            <p>
              This is the first FAQ Answer. It's quite a verbose one, really. In
              fact, wouldn't you know that the person is simply using this as
              example text for what the accordion could possibly reveal? Pretty
              meta right? The worlds crazy and we're living in crazy times.
              Calls for crazy meta accordion measures.
            </p>
          </AccordionItem>
          <AccordionItem heading="Second FAQ Question">
            <p>Hello world!</p>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
};

export default GetHelp;
