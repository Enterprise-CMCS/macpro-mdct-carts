import { fetchAuthSession } from "aws-amplify/auth";

async function requestOptions(body = null) {
  try {
    const { idToken } = (await fetchAuthSession()).tokens ?? {};
    const options = {
      headers: { "x-api-key": idToken.toString() },
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
