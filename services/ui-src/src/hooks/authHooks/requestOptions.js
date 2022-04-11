import { Auth } from "aws-amplify";

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

export default requestOptions;
