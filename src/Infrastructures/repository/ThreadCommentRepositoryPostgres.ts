import { Pool, QueryConfig, QueryResult } from "pg";
import ThreadCommentRepository from "../../Domains/comments/ThreadCommentsRepository";
import { AddedComment, Comment, CommentEntity, DeletedComment } from "../../Domains/entities/Comment";
import NotFoundError from "../../Common/Errors/NotFoundError";

export default class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  private readonly pool;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  async getCommentById(id: string) {
    const query: QueryConfig = {
      text: `SELECT * FROM thread_comments WHERE id=$1`,
      values: [id]
    };

    const { rows }: QueryResult<CommentEntity> = await this.pool.query(query);
    if(!rows[0]) throw new NotFoundError("comment tidak ditemukan");

    return rows[0];
  }

  async addComment(comment: Comment) {
    const { id, threadId: thread_id, content, username } = comment;
    const query: QueryConfig = {
      text: "INSERT INTO thread_comments VALUES($1, $2, $3, $4) RETURNING id, content, username AS owner",
      values: [id, thread_id, content, username]
    };

    const { rows }: QueryResult<AddedComment> = await this.pool.query(query);
    return rows[0];
  }

  async addCommentReply(comment: Comment) {
    const { id, threadId, replyTo, content, username } = comment;
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const { rowCount } = await client.query(
        'SELECT * FROM thread_comments WHERE id = $1',
        [replyTo]
      );

      if (!rowCount) {
        await client.query('ROLLBACK');
        throw new NotFoundError('komentar tidak ditemukan');
      }

      const { rows }: QueryResult<AddedComment>  = await client.query(
        `INSERT INTO thread_comments(id, thread_id, reply_to, content, username) 
        VALUES($1, $2, $3, $4, $5)
        RETURNING id, content, username AS owner
        `,
        [id, threadId, replyTo, content, username]
      );

      await client.query('COMMIT');
      return rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteComment(commentId: string) {
    const query: QueryConfig = {
      text: "UPDATE thread_comments SET is_delete=$2 WHERE id=$1 RETURNING content",
      values: [commentId, true]
    };

    const { rows }: QueryResult<DeletedComment> = await this.pool.query(query);

    if(!rows[0]) throw new NotFoundError("comment tidak ditemukan");

    return rows[0];
  }
}