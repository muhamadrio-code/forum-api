import { ValidationResult } from "../../Domains/entities/definitions";

export default abstract class Validator {
  abstract validatePayload<T>(payload: T): ValidationResult<T>
}