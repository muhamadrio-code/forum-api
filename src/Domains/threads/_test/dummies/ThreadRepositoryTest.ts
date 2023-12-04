/* eslint-disable @typescript-eslint/no-unused-vars */
import ThreadRepository from "../../ThreadRepository";
import { AddedThread, Thread, ThreadEntity, ThreadDetailsEntity } from "../../entities";

export default class ThreadCommentsRepositoryTest extends ThreadRepository {
  async addThread(thread: Thread): Promise<AddedThread> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async getThreadById(id: string): Promise<ThreadEntity> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async getThreadDetails(id: string): Promise<ThreadDetailsEntity> {
    throw new Error('UNINPLEMENTED.ERROR');
  }
}