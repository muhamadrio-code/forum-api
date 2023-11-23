import Validator from "../../Applications/security/Validator";
import ValidationError from "../../Common/Errors/ValidationError";
import { CommentShceme } from "../../Domains/comments/schemes";
export default class ZodThreadCommentValidator extends Validator {
  validatePayload<CP>(payload: CP): Readonly<CP> {
    const result = CommentShceme.safeParse(payload);

    if (!result.success) {
      const error = result.error.issues
        .map(({ message }) => message)
        .reduce((prev, curr) => prev + ';\n' + curr);
      throw new ValidationError(error);
    }

    return payload;
  }
}