/* eslint-disable @typescript-eslint/no-unused-vars */
import CommentReplyRepository from "../../CommentReplyRepository";
import { CommentReply, AddedReply, DeletedReply, CommentReplyEntity } from "../../entities";

export default class CommentsReplyRepositoryTest extends CommentReplyRepository {
  async addReply(commentReply: CommentReply): Promise<AddedReply> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async deleteReplyById(replyId: string): Promise<DeletedReply> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async getRepliesByCommentId(commentId: string): Promise<CommentReplyEntity[]> {
    throw new Error('UNINPLEMENTED.ERROR');
  }
}