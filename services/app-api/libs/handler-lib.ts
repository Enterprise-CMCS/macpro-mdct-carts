import * as logger from "./debug-lib";
import { APIGatewayProxyEvent } from "../types";
import { isAuthorized } from "./authorization";
import { failure, success, buildResponse } from "./response-lib";
import { NotFoundError, UnauthorizedError } from "./httpErrors";

type LambdaFunction = (
  event: APIGatewayProxyEvent, // eslint-disable-line no-unused-vars
  context: any // eslint-disable-line no-unused-vars
) => Promise<any>;

export default function handler(lambda: LambdaFunction) {
  return async function (event: APIGatewayProxyEvent, context: any) {
    logger.init();
    logger.debug("API event: %O", {
      body: event.body,
      pathParameters: event.pathParameters,
      queryStringParameters: event.queryStringParameters,
    });

    if (await isAuthorized(event)) {
      try {
        // Run the Lambda
        const body = await lambda(event, context);
        return success(body);
      } catch (e: any) {
        // Print debug messages
        logger.error("Error: %O", e);

        const body = { error: e.message };
        switch (e.constructor) {
          case UnauthorizedError:
            return buildResponse(403, body);
          case NotFoundError:
            return buildResponse(404, body);
          default:
            return failure(body);
        }
      } finally {
        logger.flush();
      }
    } else {
      const body = { error: "User is not authorized to access this resource." };
      return buildResponse(403, body);
    }
  };
}
