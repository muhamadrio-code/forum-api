import Validator from "../../Applications/security/Validator";
import { ValidationResult, UserPayload } from "../../Applications/security/lib/definitions";
import { UserScheme } from "../../Applications/security/lib/schemes"
import { fromZodError } from "zod-validation-error";
import ValidationError from "../../Common/Errors/ValidationError";

export default class UserValidator extends Validator {
  validatePayload<UserPayload>(payload: UserPayload): ValidationResult<UserPayload> {
    const result = UserScheme.safeParse(payload)

    if (!result.success) {
      const error = fromZodError(result.error)
      throw new ValidationError(error.message)
    }

    return payload
  }
}