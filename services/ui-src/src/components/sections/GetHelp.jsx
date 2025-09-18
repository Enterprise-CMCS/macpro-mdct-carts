import React from "react";
import techIcon from "../../assets/images/noun-technical-support-1873885-D5DEE4.png";
import ActionCard from "../utils/ActionCard";
import FaqAccordion from "../layout/FaqAccordion";
import { Main } from "../layout/Main";
import { useFlags } from "launchdarkly-react-client-sdk";

const GetHelp = () => {
  const release2025 = useFlags().release2025;
  return (
    <Main className="help-page ds-l-container">
      <div className="ds-l-col--12">
        <div className="help-page-container ds-l-container">
          <h1 className="help-page-title">How can we help you?</h1>
          <p>
            Question or feedback? Please email us and we will respond as soon as
            possible. You can also review our frequently asked questions below.
          </p>
          <ActionCard icon={techIcon} iconAlt="">
            <p> For technical support and login issues: </p>
            <p>
              <strong>
                Email{" "}
                <a href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</a>
              </strong>
            </p>
          </ActionCard>
          {release2025 && (
            <>
              <h2 className="help-page-faq">Frequently Asked Questions</h2>
              <FaqAccordion />
            </>
          )}
        </div>
      </div>
    </Main>
  );
};

export default GetHelp;
