import React from "react";
import { useSelector } from "react-redux";
//components
import Part from "./Part";
import Text from "./Text";
//selectors
import { selectSubsectionTitleAndPartIDs } from "../../store/selectors";
//types
import PropTypes from "prop-types";

/*
 * Print view renders every subsection back to back, so label them the same
 * way the sidebar does ("Section 3: ...", "Section 3A: ...").
 */
const getPrintHeadings = (formData, subsectionId, title) => {
  const sectionId = subsectionId.split("-").slice(0, 2).join("-");
  const section = formData?.find(
    (item) => item?.contents?.section?.id === sectionId
  )?.contents.section;
  if (!section) return { sectionHeading: null, subsectionHeading: title };

  const { ordinal, subsections = [] } = section;
  const isFirstSubsection = subsections[0]?.id === subsectionId;
  const sectionTitle =
    ordinal > 0 ? `Section ${ordinal}: ${section.title}` : section.title;
  const sectionHeading = isFirstSubsection ? sectionTitle : null;

  const marker = subsectionId.split("-").pop().toUpperCase();
  const subsectionHeading =
    title && subsections.length > 1
      ? `Section ${ordinal}${marker}: ${title}`
      : title;

  return { sectionHeading, subsectionHeading };
};

const Subsection = ({ subsectionId, printView }) => {
  const formData = useSelector((state) => state.formData);

  const subsection = selectSubsectionTitleAndPartIDs(formData, subsectionId);

  const partIds = subsection ? subsection.parts : [];
  const title = subsection ? subsection.title : null;
  const text = subsection ? subsection.text : null;

  const { sectionHeading, subsectionHeading } = printView
    ? getPrintHeadings(formData, subsectionId, title)
    : { sectionHeading: null, subsectionHeading: title };

  return (
    <div id={subsectionId}>
      {sectionHeading && (
        <h2 className="h2-pdf-bookmark" data-testid="print-section-header">
          {sectionHeading}
        </h2>
      )}
      {subsectionHeading && (
        <h2 className="h2-pdf-bookmark">{subsectionHeading}</h2>
      )}
      {text ? (
        <div className="helper-text">
          <Text>{text}</Text>
        </div>
      ) : null}
      {partIds.map((partId, index) => (
        <Part
          key={partId}
          partId={partId}
          partNumber={partIds.length > 1 ? index + 1 : null}
          printView={printView}
        />
      ))}
    </div>
  );
};
Subsection.propTypes = {
  subsectionId: PropTypes.string.isRequired,
  printView: PropTypes.bool,
};

export default Subsection;
