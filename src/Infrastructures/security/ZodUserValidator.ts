import Validator from "../../Applications/security/Validator";
import ValidationError from "../../Common/Errors/ValidationError";
import z from "zod";

export default class ZodUserValidator extends Validator {
  validatePayload<UserPayload>(payload: UserPayload) {
    const UserScheme = z.object({
      fullname: z
        .string({
          invalid_type_error: 'tidak dapat membuat user baru karena tipe data tidak sesuai',
          required_error: 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
        })
        .min(4, {
          message: "tidak dapat membuat user baru karena karakter username kurang dari batas minimum 4 karakter"
        })
        .max(50, {
          message: 'tidak dapat membuat user baru karena karakter username melebihi batas limit 50 karakter'
        }),
      username: z
        .string({
          invalid_type_error: 'tidak dapat membuat user baru karena tipe data tidak sesuai',
          required_error: 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
        })
        .min(4, {
          message: "tidak dapat membuat user baru karena karakter username kurang dari batas minimum 4 karakter"
        })
        .max(50, {
          message: 'tidak dapat membuat user baru karena karakter username melebihi batas limit 50 karakter'
        })
        .refine((username) => username.match(/^[\w]+$/), {
          message: 'tidak dapat membuat user baru karena username mengandung karakter terlarang'
        }),
      password: z
        .string({
          invalid_type_error: 'tidak dapat membuat user baru karena tipe data tidak sesuai',
          required_error: 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
        })
        .min(3, {
          message: "tidak dapat membuat user baru karena karakter password kurang dari batas minimum 3 karakter"
        })
        .max(24, {
          message: "tidak dapat membuat user baru karena karakter password melebihi batas limit 24 karakter"
        }),
    }).strict({
      message: 'tidak dapat membuat user baru karena properti tidak sesuai'
    });

    const result = UserScheme.safeParse(payload);

    if (!result.success) {
      const error = result.error.issues
        .map(({ message }) => message)
        .reduce((prev, curr) => prev + ';\n' + curr);
      throw new ValidationError(error);
    }
  }
}
