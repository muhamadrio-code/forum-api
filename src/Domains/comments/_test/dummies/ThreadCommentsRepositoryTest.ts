/* eslint-disable @typescript-eslint/no-unused-vars */
import ThreadCommentsRepository from "../../ThreadCommentsRepository";
import { Comment, AddedComment, DeletedComment, CommentEntity } from "../../entities";

export default class ThreadCommentsRepositoryTest extends ThreadCommentsRepository {
  async addComment(comment: Comment): Promise<AddedComment> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async deleteComment(commentId: string): Promise<DeletedComment> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async getCommentById(id: string): Promise<CommentEntity> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async getCommentsByThreadId(threadId: string): Promise<CommentEntity[]> {
    throw new Error('UNINPLEMENTED.ERROR');
  }
}