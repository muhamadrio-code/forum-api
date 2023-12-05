import { Comment, AddedComment, DeletedComment, CommentEntity } from "./entities";

export default abstract class ThreadCommentRepository {
  abstract getCommentById(id:string): Promise<CommentEntity>
  /**
   * @deprecated The method should not be used
   */
  abstract getCommentReplyById(id:string): Promise<CommentEntity>
  abstract addComment(comment: Comment): Promise<AddedComment>
  abstract deleteComment(commentId: string): Promise<DeletedComment>

  /**
   * @deprecated The method should not be used
   */
  abstract addCommentReply(comment: Comment): Promise<AddedComment>
}