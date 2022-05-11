export class NotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnauthorizedError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
