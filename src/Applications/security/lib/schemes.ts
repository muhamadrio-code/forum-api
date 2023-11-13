import { z } from 'zod'

export const UserScheme = z.object({
  fullname: z.string().min(2, {
    message: "Fullname must be at least 2 characters long"
  }),
  username: z.string().min(4, {
    message: "Username must be at least 4 characters long"
  }).max(16, {
    message: "Username cannot longer than 16 characters long"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long"
  }).max(24, {
    message: "Password cannot longer than 24 characters long"
  }),
})
