import PropTypes from "prop-types";
import { STATUS_MAPPING } from "../../types";

const mapStateData = (entity, showUsername = false, timeZone) => {
  const { lastChanged, state, status, username, year } = entity;
  let lastEdited = "";

  if (lastChanged) {
    const date = new Date(lastChanged);
    // Using en-CA as they format the date to YYYY-MM-DD, HH:MM:SS where as en-US formats to DD/MM/YYYY, HH:MM:SS
    const time = new Intl.DateTimeFormat("en-CA", {
      hour12: true,
      second: "numeric",
      hour: "numeric",
      minute: "numeric",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone,
    }).format(date);
    const splitTime = time.split(",");

    lastEdited = splitTime[1]
      ? `${splitTime[0]} at ${splitTime[1].trim()}`
      : `${splitTime[0]}`;
    lastEdited += username && showUsername ? ` by ${username}` : "";
  }

  return {
    lastEdited,
    stateName: state,
    statusText: STATUS_MAPPING[status],
    year,
    entity,
  };
};

const mapStatesData = (states = [], showUsername = false, timeZone) =>
  states.map((state) => mapStateData(state, showUsername, timeZone));

mapStatesData.propTypes = {
  states: PropTypes.array.isRequired,
  showUsername: PropTypes.boolean,
  timeZone: PropTypes.string,
};

export default mapStatesData;
