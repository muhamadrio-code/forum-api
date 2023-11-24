import { Comment, AddedComment, DeletedComment } from "../entities/Comment";

export default abstract class ThreadCommentRepository {
  abstract addComment(comment: Comment): Promise<AddedComment>
  abstract deleteComment(commentId: string): Promise<DeletedComment>
}