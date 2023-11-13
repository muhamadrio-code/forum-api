import Validator from "./Validator";
import { UserPayload, ValidationResult } from "../lib/definitions";
import ValidationError from "../errors/ValidationError";
import { UserScheme } from "../lib/schemes"
import { fromZodError } from "zod-validation-error";

export default class UserValidator extends Validator<UserPayload> {
  validatePayload(payload: UserPayload): ValidationResult<Readonly<UserPayload>> {
    const result = UserScheme.safeParse(payload)

    if (!result.success) {
      const error = fromZodError(result.error)

      return {
        success: false,
        error: new ValidationError(error.message)
      }
    }

    return {
      success: true,
      data: payload
    }
  }
}
