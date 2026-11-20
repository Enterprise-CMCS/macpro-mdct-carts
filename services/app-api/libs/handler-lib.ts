import * as logger from "./debug-lib";
import { APIGatewayProxyEvent } from "../types";
import {
  authenticateUser,
  isAuthorized,
  UserCredentials,
} from "./authorization";
import { failure, success, buildResponse } from "./response-lib";
import {
  BadRequestError,
  NotFoundError,
  ServiceUnavailableError,
  UnauthenticatedError,
  UnauthorizedError,
} from "./httpErrors";

type LambdaFunction = (
  event: APIGatewayProxyEvent,
  context: any,
  user: UserCredentials
) => Promise<any>;

export default function handler(lambda: LambdaFunction) {
  return async function (event: APIGatewayProxyEvent, context: any) {
    logger.init();
    logger.debug("API event: %O", {
      body: event.body,
      pathParameters: event.pathParameters,
      queryStringParameters: event.queryStringParameters,
    });
    // API Gateway's ID for this request. It's logged with any error and sent
    // back on unexpected ones, so a user's report can be matched to the logs.
    const requestId: string | undefined = event.requestContext?.requestId;

    try {
      const user = await authenticateUser(event);

      if (!isAuthorized(event, user)) {
        return buildResponse(403, {
          error: "User is not authorized to access this resource.",
        });
      }

      const body = await lambda(event, context, user);
      return success(body);
    } catch (error: any) {
      // authorization.ts already logged these at the right level
      if (
        !(error instanceof UnauthenticatedError) &&
        !(error instanceof ServiceUnavailableError)
      ) {
        logger.error("Error (request %s): %O", requestId, error);
      }

      const body = { error: error.message };
      switch (error.constructor) {
        case UnauthenticatedError:
          return buildResponse(401, body);
        case UnauthorizedError:
          return buildResponse(403, body);
        case ServiceUnavailableError:
          return buildResponse(503, body);
        case BadRequestError:
          return buildResponse(400, body);
        case NotFoundError:
          return buildResponse(404, body);
        default:
          // Unexpected errors can carry internal details, so since its
          // logged above; return a generic error.
          return failure({ error: "Internal server error", requestId });
      }
    } finally {
      logger.flush();
    }
  };
}
