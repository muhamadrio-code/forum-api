import Validator from "../../Applications/security/Validator";
import { UserScheme } from "../../Domains/users/schemes";
import ValidationError from "../../Common/Errors/ValidationError";

export default class ZodUserValidator extends Validator {
  validatePayload<UserPayload>(payload: UserPayload) {
    const result = UserScheme.safeParse(payload);

    if (!result.success) {
      const error = result.error.issues
        .map(({ message }) => message)
        .reduce((prev, curr) => prev + ';\n' + curr);
      throw new ValidationError(error);
    }
  }
}
