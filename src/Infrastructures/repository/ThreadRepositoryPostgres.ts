import { Pool, QueryConfig, QueryResult } from "pg";
import { Thread, ThreadEntity, AddedThread, ThreadDetails } from "../../Domains/entities/Thread";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import NotFoundError from "../../Common/Errors/NotFoundError";

export default class ThreadRepositoryPostgres extends ThreadRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  async addThread(thread: Thread) {
    const { id, title, body, username } = thread;
    const query: QueryConfig = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, username as owner",
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

    if (!rows.length) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return rows[0];
  }

  async verifyThreadAvaibility(id: string) {
    await this.getThreadById(id);
  }

  async getThreadDetails(id: string) {
    const query: QueryConfig = {
      text: `SELECT threads.*, COALESCE(
        JSONB_AGG(TO_JSONB(tc.*) - '["thread_id", "is_delete"]') 
        FILTER (WHERE tc.* IS NOT NULL), '[]'
      ) AS comments
      FROM threads 
      LEFT JOIN thread_comments AS tc
      ON tc.thread_id = threads.id
      WHERE threads.id = $1
      GROUP BY threads.id
      `,
      values: [id]
    };
    const { rows }: QueryResult<ThreadDetails> = await this.pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return rows[0];
  }
}