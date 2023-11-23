import z from "zod";

export const CommentShceme = z.object({
  content: z.string({
    invalid_type_error: "tidak dapat membuat comment baru, tipe data tidak sesuai",
    required_error: "tidak dapat membuat comment baru, content tidak boleh kosong"
  })
})
  .strict({
    message: 'tidak dapat membuat thread baru karena properti tidak sesuai'
  });