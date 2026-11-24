class HttpError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends HttpError {}

/** 401: missing or invalid token */
export class UnauthenticatedError extends HttpError {}

/** 403: valid user, not allowed */
export class UnauthorizedError extends HttpError {}

/** 503: couldn't check the token right now */
export class ServiceUnavailableError extends HttpError {}

/** 400: the request itself is wrong (missing or invalid input) */
export class BadRequestError extends HttpError {}
