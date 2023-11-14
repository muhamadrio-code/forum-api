import Validator from "./Validator";
import { UserPayload, ValidationResult } from "../lib/definitions";
import ValidationError from "../../../Common/errors/ValidationError";
import { UserScheme } from "../lib/schemes"
import { fromZodError } from "zod-validation-error";

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
