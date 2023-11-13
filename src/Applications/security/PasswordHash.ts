import bcrypt from 'bcrypt';
import { PasswordScheme } from './lib/schemes'
import { fromZodError } from 'zod-validation-error'

export default class PasswordHash {
  async hash(password: string): Promise<string> {
    if(password.length <= 0) throw new Error("Password length must > 0")
    const result = PasswordScheme.safeParse({ password })
    if(!result.success) throw new Error(fromZodError(result.error).message)
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  }

  async comparePassword(plain: string, encrypted: string): Promise<string> {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}