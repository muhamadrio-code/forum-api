/* istanbul ignore file */
export default abstract class ClientError extends Error {
  readonly statusCode;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ClientError.prototype);
    this.name = 'ClientError';
  }
}