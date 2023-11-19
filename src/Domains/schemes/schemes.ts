import { z } from 'zod'

export const UserScheme = z.object({
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
    .min(6, {
      message: "tidak dapat membuat user baru karena karakter password kurang dari batas minimum 6 karakter"
    })
    .max(24, {
      message: "tidak dapat membuat user baru karena karakter password melebihi batas limit 24 karakter"
    }),
}).strict({
  message: 'tidak dapat membuat user baru karena properti tidak sesuai'
})

export const UserLoginScheme = z.object({
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
    .min(6, {
      message: "karakter password kurang dari batas minimum 6 karakter"
    })
    .max(24, {
      message: "karakter password melebihi batas limit 24 karakter"
    }),
}, {
  invalid_type_error: "Invalid payload type",
  required_error: "harus mengirimkan username dan password"
}).strict({
  message: 'tidak dapat login karena properti tidak sesuai'
})
