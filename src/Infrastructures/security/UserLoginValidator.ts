import Validator from "../../Applications/security/Validator";
import { ValidationResult, UserLoginPayload } from "../../Domains/entities/definitions";
import { UserLoginScheme } from "../../Domains/schemes/schemes"
import { fromZodError } from "zod-validation-error";
import ValidationError from "../../Common/Errors/ValidationError";

export default class UserValidator extends Validator {
  validatePayload<UserLoginPayload>(payload: UserLoginPayload): ValidationResult<UserLoginPayload> {
    const result = UserLoginScheme.safeParse(payload)

    if (!result.success) {
      const error = fromZodError(result.error)
      throw new ValidationError(error.message)
    }

    return payload
  }
}