import { Pool, QueryConfig, QueryResult } from "pg";
import ThreadCommentRepository from "../../Domains/comments/ThreadCommentsRepository";
import { AddedComment, Comment, DeletedComment } from "../../Domains/entities/Comment";
import NotFoundError from "../../Common/Errors/NotFoundError";

export default class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  private readonly pool;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  async addComment(comment: Comment): Promise<AddedComment> {
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