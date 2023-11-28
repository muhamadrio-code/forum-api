/* istanbul ignore file */

import { Pool, QueryResult } from "pg";
import { CommentEntity, Comment } from "../../../../Domains/entities/Comment";
import { ThreadEntity } from "../../../../Domains/entities/Thread";

type TableName = string & ('users' | 'authentications' | 'threads' | 'thread_comments')

type Config = {
  pool: Pool,
  tableName: TableName | TableName[],
}

export const PostgresTestHelper = {
  async addToken(pool: Pool, token:string) {
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token]
    };

    await pool.query(query);
  },

  async addUser(
    pool: Pool,
    user: {
      id: string,
      username: string,
      password: string,
      fullname: string,
    }
  ) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [user.id, user.fullname, user.username, user.password],
    };

    await pool.query(query);
  },
  async getCommentById(pool: Pool, id:string) {
    const query = {
      text: "SELECT * FROM thread_comments WHERE id=$1",
      values: [id]
    };

    const { rows }: QueryResult<CommentEntity> = await pool.query(query);
    return rows[0];
  },

  async getThreadById(pool: Pool, id:string) {
    const query = {
      text: "SELECT * FROM threads WHERE id=$1",
      values: [id]
    };

    const { rows }: QueryResult<ThreadEntity> = await pool.query(query);
    return rows[0];
  },
  async addComment(
    pool: Pool,
    comment: Comment
  ) {
    const { id, threadId: thread_id, content, username } = comment;
    const query = {
      text: "INSERT INTO thread_comments VALUES($1, $2, $3, $4) RETURNING id, content, username AS owner",
      values: [id, thread_id, content, username]
    };

    await pool.query(query);
  },
  async addCommentReply(
    pool: Pool,
    comment: Comment
  ) {
    const { id, threadId, replyTo, content, username, isDelete: is_delete } = comment;
    await pool.query(
      `INSERT INTO thread_comments(id, thread_id, reply_to, content, username, is_delete) 
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id, content, username AS owner
      `,
      [id, threadId, replyTo, content, username, is_delete]
    );
  },

  async truncate(config: Config) {
    const { pool, tableName } = config;
    if(Array.isArray(tableName)) {
      const tables = tableName.join();
      await pool.query(`TRUNCATE ${tables} CASCADE`);
    } else {
      await pool.query(`TRUNCATE ${tableName} CASCADE`);
    }
  },
};
