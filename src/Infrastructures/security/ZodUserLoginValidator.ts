import Validator from "../../Applications/security/Validator";
import ValidationError from "../../Common/Errors/ValidationError";
import z from "zod";

export default class ZodUserLoginValidator extends Validator {
  validatePayload<UserLoginPayload>(payload: UserLoginPayload) {
    const UserLoginScheme = z.object({
      username: z
        .string({
          invalid_type_error: 'username dan password harus string',
          required_error: 'harus mengirimkan username'
        })
        .min(4, {
          message: "karakter username kurang dari batas minimum 4 karakter"
        })
        .max(50, {
          message: 'karakter username melebihi batas limit 50 karakter'
        })
        .refine((username) => username.match(/^[\w]+$/), {
          message: 'username mengandung karakter terlarang'
        }),
      password: z
        .string({
          invalid_type_error: 'username dan password harus string',
          required_error: 'harus mengirimkan password'
        })
        .min(3, {
          message: "karakter password kurang dari batas minimum 3 karakter"
        })
        .max(24, {
          message: "karakter password melebihi batas limit 24 karakter"
        }),
    }, {
      invalid_type_error: "Invalid payload type",
      required_error: "harus mengirimkan username dan password"
    }).strict({
      message: 'tidak dapat login karena properti tidak sesuai'
    });

    const result = UserLoginScheme.safeParse(payload);

    if (!result.success) {
      const error = result.error.issues
        .map(({ message }) => message)
        .reduce((prev, curr) => prev + ';\n' + curr);
      throw new ValidationError(error);
    }
  }
}