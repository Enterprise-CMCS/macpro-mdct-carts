import { Auth } from "aws-amplify";

async function requestOptions(body = null) {
  try {
    const session = await Auth.currentSession();
    const token = await session.getIdToken().getJwtToken();

    const options = {
      headers: { "x-api-key": token },
    };
    if (body) {
      options["body"] = body;
    }
    return options;
  } catch (e) {
    console.log({ e }); // eslint-disable-line no-console
  }
}

export default requestOptions;
