import z from "zod";

export const ThreadScheme = z.object({
  title: z
    .string({
      required_error: "tidak dapat membuat thread baru karena properti title tidak ada",
      invalid_type_error: "tidak dapat membuat thread baru karena tipe data tidak sesuai"
    })
    .min(1, {
      message: "tidak dapat membuat thread baru, title tidak boleh kosong"
    })
    .max(144, {
      message: "tidak dapat membuat thread baru, title melebihi batas limit karakter"
    })
    .trim(),
  body: z
    .string({
      required_error: "tidak dapat membuat thread baru karena properti body tidak ada",
      invalid_type_error: "tidak dapat membuat thread baru karena tipe data tidak sesuai"
    })
    .min(1, {
      message: "tidak dapat membuat thread baru, body tidak boleh kosong"
    })
    .trim()
}, {
  required_error: 'tidak dapat membuat thread baru karena properti tidak sesuai',
  invalid_type_error: 'tidak dapat membuat thread baru karena properti tidak sesuai',
}).strict({
    message: 'tidak dapat membuat thread baru karena properti tidak sesuai'
  });
