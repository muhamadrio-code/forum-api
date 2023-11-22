import { Comment, AddedComment } from "../entities/Comment";

export default abstract class ThreadCommentsRepository {
  abstract addComment(comment: Comment): Promise<AddedComment>
}