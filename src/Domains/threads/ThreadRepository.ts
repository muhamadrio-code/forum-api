import { AddedThread, Thread, ThreadDetailsEntity, ThreadEntity } from "./entities";

export default abstract class ThreadRepository {
  abstract addThread(thread: Thread): Promise<AddedThread>
  abstract getThreadById(id: string): Promise<ThreadEntity>

  /**
   * @deprecated should not use this function
   */
  abstract getThreadDetails(id: string): Promise<ThreadDetailsEntity>
}