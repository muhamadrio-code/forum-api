import { Pool, QueryConfig, QueryResult } from "pg";
import { Thread, ThreadEntity, AddedThread } from "../../Domains/entities/Thread";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import InvariantError from "../../Common/Errors/InvariantError";

export default class ThreadRepositoryPostgres extends ThreadRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  async addThread(thread: Thread) {
    const { id, title, body, username } = thread;
    const query: QueryConfig = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, username",
      values: [id, title, body, username]
    };

    const { rows }: QueryResult<AddedThread> = await this.pool.query(query);
    return rows[0];
  }

  async getThreadById(id: string) {
    const query: QueryConfig = {
      text: "SELECT * FROM threads WHERE id=$1",
      values: [id]
    };

    const { rows }: QueryResult<ThreadEntity> = await this.pool.query(query);
    return rows[0];
  }

  async verifyThreadAvaibility(id: string) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new InvariantError('thread tidak ditemukan');
    }
  }
}