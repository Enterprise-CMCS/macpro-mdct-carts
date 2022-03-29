import { API, Auth } from "aws-amplify";

export const getHello =
  (inputObj) => async (dispatch, getState) => {
    try {
      const opts = await requestOptions();
      opts.body = inputObj.body;
      const result = await API.get(
        "carts-api",
        `/hello`,
        opts
      );  
      // Dispatch on success
      console.log('success', result)
    } catch (e) {
      // Dispatch failure
      console.log("ERROR NO HELLO")
    }
  };



async function requestOptions() {
  try {
    const session = await Auth.currentSession();
    const token = await session.getIdToken().getJwtToken();

    const options = {
      headers: { "x-api-key": token },
    };
    return options;
  } catch (e) {
    console.log({ e });
  }
}