import { Pool, QueryConfig, QueryResult } from "pg";
import ThreadCommentRepository from "../../Domains/comments/ThreadCommentsRepository";
import { AddedComment, Comment, CommentEntity, DeletedComment } from "../../Domains/comments/entities";
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

  async getCommentsByThreadId(threadId: string): Promise<CommentEntity[]> {
    const query: QueryConfig = {
      text: `SELECT * FROM thread_comments WHERE thread_id=$1`,
      values: [threadId]
    };

    const { rows }: QueryResult<CommentEntity> = await this.pool.query(query);
    return rows;
  }

  async addComment(comment: Comment) {
    const { id, thread_id, content, username } = comment;
    const query: QueryConfig = {
      text: "INSERT INTO thread_comments VALUES($1, $2, $3, $4) RETURNING id, content, username AS owner",
      values: [id, thread_id, content, username]
    };

    const { rows }: QueryResult<AddedComment> = await this.pool.query(query);
    return rows[0];
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