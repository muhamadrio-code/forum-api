import Validator from "../../Applications/security/Validator";
import ValidationError from "../../Common/Errors/ValidationError";
import { ThreadScheme } from "../../Domains/threads/schemes";

export default class ZodThreadValidator extends Validator {
  validatePayload<ThreadPayload>(payload: ThreadPayload) {
    const result = ThreadScheme.safeParse(payload);

    if (!result.success) {
      const error = result.error.issues
        .map(({ message }) => message)
        .reduce((prev, curr) => prev + ';\n' + curr);
      throw new ValidationError(error);
    }
  }
}