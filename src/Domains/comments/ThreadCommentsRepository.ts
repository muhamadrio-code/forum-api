import { Comment, AddedComment, DeletedComment, CommentEntity } from "./entities";

export default abstract class ThreadCommentRepository {
  abstract getCommentById(id:string): Promise<CommentEntity>
  abstract getCommentsByThreadId(threadId:string): Promise<CommentEntity[]>
  abstract addComment(comment: Comment): Promise<AddedComment>
  abstract deleteComment(commentId: string): Promise<DeletedComment>
}