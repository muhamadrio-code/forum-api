import { AddedThread, Thread, ThreadDetailsEntity, ThreadEntity } from "./entities";

export default abstract class ThreadRepository {
  abstract addThread(thread: Thread): Promise<AddedThread>
  abstract getThreadById(id: string): Promise<ThreadEntity>
  abstract getThreadDetails(id: string): Promise<ThreadDetailsEntity>
}