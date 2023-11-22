import Validator from "../../Applications/security/Validator";
import { ValidationResult } from "../../Domains/entities/definitions";
import ValidationError from "../../Common/Errors/ValidationError";
import { ThreadScheme } from "../../Domains/threads/schemes";

export default class ZodThreadValidator extends Validator {
  validatePayload<TPayload>(payload: TPayload): ValidationResult<TPayload> {
    const result = ThreadScheme.safeParse(payload);

    if (!result.success) {
      const error = result.error.issues
        .map(({ message }) => message)
        .reduce((prev, curr) => prev + ';\n' + curr);
      throw new ValidationError(error);
    }

    return payload;
  }
}