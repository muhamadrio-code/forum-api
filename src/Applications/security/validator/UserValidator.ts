import Validator from "./Validator";
import { UserPayload, ValidationResult } from "../lib/definitions";
import ValidationError from "../errors/ValidationError";
import { UserScheme } from "../lib/schemes"

export default class UserValidator extends Validator<UserPayload> {
  validatePayload(payload: UserPayload): ValidationResult<Readonly<UserPayload>> {
    const result = UserScheme.safeParse(payload)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors

      return {
        success: false,
        error: new ValidationError(fieldErrors)
      }
    }

    return {
      success: true,
      data: payload
    }
  }
}
