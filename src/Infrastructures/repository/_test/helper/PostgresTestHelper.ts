/* istanbul ignore file */

import { Pool, QueryResult } from "pg";
import { CommentEntity } from "../../../../Domains/comments/entities";
import { ThreadEntity } from "../../../../Domains/threads/entities";
import { CommentReplyEntity } from "../../../../Domains/replies/entities";

type TableName = string & ('users' | 'authentications' | 'threads' | 'thread_comments' | 'replies')

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
  async getCommentReplyById(pool: Pool, id:string) {
    const query = {
      text: "SELECT * FROM replies WHERE id=$1",
      values: [id]
    };

    const { rows }: QueryResult<CommentReplyEntity> = await pool.query(query);
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
