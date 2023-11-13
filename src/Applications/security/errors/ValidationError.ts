export default class ValidationError extends Error {
  readonly code: number;
  readonly fieldsErrors: unknown;

  constructor(fieldsErrors?: unknown) {
    super("Validation Error, Payload does not met requirement")
    this.code = 500
    this.fieldsErrors = fieldsErrors
  }
}