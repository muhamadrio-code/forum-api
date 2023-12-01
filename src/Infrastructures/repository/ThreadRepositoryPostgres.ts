import { Pool, QueryConfig, QueryResult } from "pg";
import { Thread, ThreadEntity, AddedThread, ThreadDetailsEntity } from "../../Domains/entities/Thread";
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

  async getThreadDetails(id: string) {
    const query: QueryConfig = {
      text: `
      SELECT
        threads.*,
        COALESCE(JSONB_AGG(TO_JSONB (d.*) - 'thread_id') FILTER (WHERE d.id IS NOT NULL), 'null') AS comments
      FROM
        threads
        LEFT JOIN (
          SELECT
            a.id,
            a.username,
            a.date,
            a.thread_id,
            a.content,
            a.is_delete,
            COALESCE(JSONB_AGG(TO_JSONB (b.*) - 'reply_to') FILTER (WHERE b.id IS NOT NULL), '[]') AS replies
          FROM
            thread_comments a
            LEFT JOIN (
              SELECT
                id,
                reply_to,
                is_delete,
                date,
                username,
                content
              FROM
                thread_comments AS c
              WHERE
                reply_to IS NOT NULL
              ORDER BY
                date ASC) b
            ON a.id = b.reply_to
            WHERE
              a.reply_to IS NULL
            GROUP BY
              a.id,
              b.reply_to
            ORDER BY
              date ASC) AS d ON d.thread_id = threads.id
      WHERE
        threads.id = $1
      GROUP BY
        threads.id
      `,
      values: [id]
    };

    const { rows }: QueryResult<ThreadDetailsEntity> = await this.pool.query(query);
    if (!rows.length) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return rows[0];
  }
}