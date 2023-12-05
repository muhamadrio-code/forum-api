import { AddedReply, CommentReply, CommentReplyEntity } from "./entities";

export default abstract class CommentReplyRepository {
  abstract getRepliesByCommentIds(commentIds: string[]): Promise<{ [id:string] : CommentReplyEntity[] }>
  abstract addReply(commentReply: CommentReply): Promise<AddedReply>
  abstract deleteReplyById(replyId: string): Promise<void>
  abstract getReplyById(replyId: string): Promise<CommentReplyEntity>
}