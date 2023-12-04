/* eslint-disable @typescript-eslint/no-unused-vars */
import PasswordHash from "../../PasswordHash";

export default class PasswordHashTest extends PasswordHash {
  async comparePassword(plain: string, encrypted: string): Promise<boolean> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async hash(password: string): Promise<string> {
    throw new Error('UNINPLEMENTED.ERROR');
  }
}