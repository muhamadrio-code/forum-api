import { AddedThread, Thread, ThreadEntity } from "../entities/Thread";

export default abstract class ThreadRepository {
  abstract addThread(thread: Thread): Promise<AddedThread>
  abstract getThreadById(id: string): Promise<ThreadEntity>
  abstract verifyThreadAvaibility(id: string): Promise<void>
}