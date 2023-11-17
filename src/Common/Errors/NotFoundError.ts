import ClientError from "./ClientError";

export default class NotFoundError extends ClientError {
  readonly statusCode: number;
  constructor(message:string) {
    super(message)
    this.statusCode = 404
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}