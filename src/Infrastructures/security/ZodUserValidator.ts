import Validator from "../../Applications/security/Validator";
import { ValidationResult, UserPayload } from "../../Domains/entities/definitions";
import { UserScheme } from "../../Domains/schemes/schemes"
import ValidationError from "../../Common/Errors/ValidationError";

export default class ZodUserValidator extends Validator {
  validatePayload<UserPayload>(payload: UserPayload): ValidationResult<UserPayload> {
    const result = UserScheme.safeParse(payload)

    if (!result.success) {
      const error = result.error.issues
        .map(({ message }) => message)
        .reduce((prev, curr) => prev + ';\n' + curr)
      throw new ValidationError(error)
    }

    return payload
  }
}
