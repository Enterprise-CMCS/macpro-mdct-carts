import { useEffect, useState } from "react";
import {
  differenceInMinutes,
  format,
  formatDistanceToNowStrict,
} from "date-fns";
import PropTypes from "prop-types";

const SaveMessage = ({ lastSaved }) => {
  const [currentMoment, setCurrentMoment] = useState(() => Date.now());

  useEffect(() => {
    const timerID = setInterval(() => setCurrentMoment(Date.now()), 1000);
    return () => clearInterval(timerID);
  });

  if (!lastSaved) return "Not yet saved";
  if (differenceInMinutes(currentMoment, lastSaved) < 1) return "Saved";

  return `Last saved ${format(lastSaved, "p")} (${formatDistanceToNowStrict(
    lastSaved
  )} ago)`;
};

SaveMessage.propTypes = {
  lastSaved: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
};

export default SaveMessage;
