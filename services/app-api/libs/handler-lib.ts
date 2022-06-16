import * as debug from "./debug-lib";
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { isAuthorized } from "./authorization";
import { failure, success, buildResponse } from "./response-lib";
import { NotFoundError, UnauthorizedError } from "./httpErrors";

type LambdaFunction = (
  event: APIGatewayProxyEvent, // eslint-disable-line no-unused-vars
  context: any // eslint-disable-line no-unused-vars
) => Promise<any>;

export default function handler(lambda: LambdaFunction) {
  return async function (event: APIGatewayProxyEvent, context: any) {
    // Start debugger
    debug.init(event, context);

    if (await isAuthorized(event)) {
      try {
        // Run the Lambda
        const body = await lambda(event, context);
        return success(body);
      } catch (e: any) {
        // Print debug messages
        debug.flush(e);

        const body = { error: e.message };
        switch (e.constructor) {
          case UnauthorizedError:
            return buildResponse(403, body);
          case NotFoundError:
            return buildResponse(404, body);
          default:
            return failure(body);
        }
      }
    } else {
      const body = { error: "User is not authorized to access this resource." };
      return buildResponse(403, body);
    }
  };
}
