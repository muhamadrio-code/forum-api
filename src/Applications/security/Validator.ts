import { ValidationResult } from "./lib/definitions";

export default abstract class Validator {
  abstract validatePayload<T>(payload: T): ValidationResult<T>
}