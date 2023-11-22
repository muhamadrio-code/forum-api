import z from "zod";

export const CommentShceme = z.object({
  content: z.string({
    invalid_type_error: "tidak dapat membuat thread baru, tipe data tidak sesuai",
    required_error: "tidak dapat membuat thread baru, content tidak boleh kosong"
  })
});