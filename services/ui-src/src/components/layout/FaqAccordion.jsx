import React from "react";
// components
import { Accordion, AccordionItem } from "@cmsgov/design-system";
// types
import PropTypes from "prop-types";

const FaqAccordion = ({ accordionItems }) => {
  const renderAnswer = (item) => {
    switch (item.type) {
      case "text":
        return <p>{item.answer}</p>;
      case "list":
        return (
          <div>
            <p>{item.listHeading}</p>
            <ul>
              {item.listAnswers.map((ans, index) => (
                <li key={`faqanswer-${index}`}>{ans}</li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Accordion>
      {accordionItems.map((item, index) => (
        <AccordionItem key={`faqquestion-${index}`} heading={item.question}>
          {renderAnswer(item)}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

FaqAccordion.propTypes = {
  accordionItems: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      answer: PropTypes.string,
      listHeading: PropTypes.string,
      listAnswers: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default FaqAccordion;
