import { Pool, QueryConfig, QueryResult } from "pg";
import ThreadCommentsRepository from "../../Domains/comments/ThreadCommentsRepository";
import { AddedComment, Comment } from "../../Domains/entities/Comment";

export default class ThreadCommentRepositoryPostgres extends ThreadCommentsRepository {
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
}