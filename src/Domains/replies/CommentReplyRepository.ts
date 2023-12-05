import { AddedReply, CommentReply, CommentReplyEntity, DeletedReply } from "./entities";

export default abstract class CommentReplyRepository {
  abstract getRepliesByCommentId(commentId: string): Promise<CommentReplyEntity[]>
  abstract addReply(commentReply: CommentReply): Promise<AddedReply>
  abstract deleteReplyById(replyId: string): Promise<DeletedReply>
}