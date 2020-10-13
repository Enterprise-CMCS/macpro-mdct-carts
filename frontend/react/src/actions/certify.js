import axios from "../axios";

export const certifyAndSubmit = () => async (dispatch, getState) => {
  const reportId = getState().reportStatus.id;
  if (reportId) {
    dispatch({ type: certifyAndSubmit.toString() });
    try {
      await axios.patch(`/state_status/${reportId}/`, {
        last_changed: new Date(),
        status: "certified",
      });
      dispatch({ type: certifyAndSubmit.success });
    } catch (e) {
      dispatch({ type: certifyAndSubmit.failure });
    }
  }
};
certifyAndSubmit.toString = () => "certify/certifyAndSubmit";
certifyAndSubmit.success = `${certifyAndSubmit}/success`;
certifyAndSubmit.failure = `${certifyAndSubmit}/failure`;

export const done = () => ({
  type: done.toString(),
});
done.toString = () => "certify/done";
