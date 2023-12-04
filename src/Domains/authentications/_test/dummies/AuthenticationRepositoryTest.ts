/* eslint-disable @typescript-eslint/no-unused-vars */
import AuthenticationRepository from "../../AuthenticationRepository";

export default class PasswordHashTest extends AuthenticationRepository {
  async addToken(token: string): Promise<void> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async deleteToken(token: string): Promise<number> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async verifyToken(token: string): Promise<void> {
    throw new Error('UNINPLEMENTED.ERROR');
  }
}