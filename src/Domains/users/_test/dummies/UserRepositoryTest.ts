/* eslint-disable @typescript-eslint/no-unused-vars */
import UserRepository from "../../UserRepository";
import { User, RegisteredUser } from "../../entities";

export default class ThreadCommentsRepositoryTest extends UserRepository {
  async addUser(user: User): Promise<RegisteredUser> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async getIdByUsername(username: string): Promise<string> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async getUserByUsername(username: string): Promise<RegisteredUser> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async getUserPasswordByUsername(username: string): Promise<string> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async verifyUsernameAvailability(username: string): Promise<void> {
    throw new Error('UNINPLEMENTED.ERROR');
  }
}