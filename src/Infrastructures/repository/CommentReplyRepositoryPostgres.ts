import { Pool, QueryConfig, QueryResult } from 'pg';
import CommentReplyRepository from '../../Domains/replies/CommentReplyRepository';
import { CommentReply, AddedReply, CommentReplyEntity } from '../../Domains/replies/entities';
import NotFoundError from '../../Common/Errors/NotFoundError';

export default class CommentReplyRepositoryPostgres extends CommentReplyRepository {
  private readonly pool:Pool;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  async addReply(reply: CommentReply): Promise<AddedReply> {
    const { id, thread_id, content, username, comment_id } = reply;
    const query : QueryConfig = {
      text: `
      INSERT INTO 
        replies(id, thread_id, content, username, comment_id)
      VALUES ( $1, $2, $3, $4, $5 )
      RETURNING 
        id,
        content,
        username AS owner
      `,
      values: [id, thread_id, content, username, comment_id]
    };

    const { rows }: QueryResult<AddedReply> = await this.pool.query(query);

    return rows[0];
  }

  async deleteReplyById(replyId: string): Promise<void> {
    const query: QueryConfig = {
      text: "UPDATE replies SET is_delete=$2 WHERE id=$1 RETURNING id",
      values: [replyId, true]
    };

    const { rows } = await this.pool.query(query);

    if(!rows[0]) throw new NotFoundError("balasan tidak ditemukan");
  }

  async getRepliesByCommentId(commentId: string): Promise<CommentReplyEntity[]> {
    const query: QueryConfig = {
      text: `SELECT * FROM replies WHERE comment_id=$1`,
      values: [commentId]
    };

    const { rows }: QueryResult<CommentReplyEntity> = await this.pool.query(query);
    if(!rows[0]) throw new NotFoundError("balasan tidak ditemukan");

    return rows;
  }

  async getReplyById(replyId: string): Promise<CommentReplyEntity> {
    const query: QueryConfig = {
      text: `SELECT * FROM replies WHERE id=$1`,
      values: [replyId]
    };

    const { rows }: QueryResult<CommentReplyEntity> = await this.pool.query(query);
    if(!rows[0]) throw new NotFoundError("balasan tidak ditemukan");

    return rows[0];
  }
}