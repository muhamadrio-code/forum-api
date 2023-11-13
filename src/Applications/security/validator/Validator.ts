import { ValidationResult } from "../lib/definitions";

export default abstract class Validator<T> {
  abstract validatePayload(payload: T): ValidationResult<Readonly<T>>
}