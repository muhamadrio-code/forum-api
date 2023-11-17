import ClientError from "./ClientError";

export default class AuthenticationError extends ClientError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}