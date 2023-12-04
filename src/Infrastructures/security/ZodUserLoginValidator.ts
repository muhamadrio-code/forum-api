import Validator from "../../Applications/security/Validator";
import { UserLoginScheme } from "../../Domains/users/schemes";
import ValidationError from "../../Common/Errors/ValidationError";

export default class ZodUserLoginValidator extends Validator {
  validatePayload<UserLoginPayload>(payload: UserLoginPayload) {
    const result = UserLoginScheme.safeParse(payload);

    if (!result.success) {
      const error = result.error.issues
        .map(({ message }) => message)
        .reduce((prev, curr) => prev + ';\n' + curr);
      throw new ValidationError(error);
    }
  }
}