export default class ValidationError extends Error {
  readonly code: number;

  constructor(message: string) {
    super(message)
    this.code = 500
    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = 'ValidationError';
  }
}