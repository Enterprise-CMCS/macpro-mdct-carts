import { API, Auth } from "aws-amplify";

async function requestOptions() {
  try {
    const session = await Auth.currentSession();
    const token = await session.getIdToken().getJwtToken();

    const options = {
      headers: { "x-api-key": token },
    };
    return options;
  } catch (e) {
    console.log({ e }); // eslint-disable-line no-console
  }
}

export const getHello = () => async (_dispatch, _getState) => {
  try {
    const opts = await requestOptions();
    const result = await API.get("carts-api", `/hello`, opts);
    // Dispatch on success
    console.log("success", result); // eslint-disable-line no-console
  } catch (e) {
    // Dispatch failure
    console.log("ERROR NO HELLO", e); // eslint-disable-line no-console
  }
};
