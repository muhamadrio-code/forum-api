import z from "zod";
import Validator from "../../Applications/security/Validator";
import ValidationError from "../../Common/Errors/ValidationError";

export default class ZodThreadCommentValidator extends Validator {
  validatePayload<ThreadCommentPayload>(payload: ThreadCommentPayload) {
    const CommentShceme = z.object({
      content: z.string({
        invalid_type_error: "tidak dapat membuat comment baru, tipe data tidak sesuai",
        required_error: "tidak dapat membuat comment baru, karena properti tidak sesuai"
      }).min(1, {
        message: 'tidak dapat membuat comment baru, content tidak boleh kosong'
      })
    }, {
      required_error: "tidak dapat membuat thread baru karena properti tidak sesuai"
    })
      .strict({
        message: 'tidak dapat membuat thread baru karena properti tidak sesuai'
      });

    const result = CommentShceme.safeParse(payload);

    if (!result.success) {
      const error = result.error.issues
        .map(({ message }) => message);
      throw new ValidationError(error[0]);
    }
  }
}