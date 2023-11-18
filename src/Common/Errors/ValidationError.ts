import ClientError from "./ClientError";

export default class ValidationError extends ClientError {

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = 'ValidationError';
  }
}