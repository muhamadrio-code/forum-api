import { Thread, ThreadEntity, ThreadSimple } from "../entities/Thread";

export default abstract class ThreadRepository {
  abstract addThread(thread: Thread): Promise<ThreadSimple>
  abstract getThreadById(id: string): Promise<ThreadEntity>
}