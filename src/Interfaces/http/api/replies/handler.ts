import { Request, ResponseToolkit } from "@hapi/hapi";
import { AddedComment, CommentPayload } from "../../../../Domains/comments/entities";
import InvariantError from "../../../../Common/Errors/InvariantError";
import AddCommentReplyUseCase from "../../../../Applications/use_cases/AddCommentReplyUseCase";
import DeleteThreadCommentReplyUseCase from "../../../../Applications/use_cases/DeleteCommentReplyUseCase";

export default class ThreadCommentReplyHandler {
  private readonly addCommentReplyUseCase: AddCommentReplyUseCase;
  private readonly deleteCommentReplyUseCase: DeleteThreadCommentReplyUseCase;

  constructor(
    addCommentReplyUseCase: AddCommentReplyUseCase,
    deleteCommentReplyUseCase: DeleteThreadCommentReplyUseCase,
  ) {
    this.addCommentReplyUseCase = addCommentReplyUseCase;
    this.deleteCommentReplyUseCase = deleteCommentReplyUseCase;
  }

  postCommentReplyHandler = async (req:Request, h: ResponseToolkit) => {
    if(req.payload === null) throw new InvariantError("Bad Request");
    const { username } = req.auth.credentials;
    const { threadId, commentId }: Record<string, string> = req.params;

    const { content }: CommentPayload = req.payload as any;
    const { content: addedContent, id, owner }: AddedComment =
      await this.addCommentReplyUseCase.execute({ content, username:username as string, thread_id: threadId, comment_id: commentId });
    return h.response({
      status: "success",
      data: {
        addedReply: {
          id,
          content: addedContent,
          owner
        }
      }
    }).code(201);
  };

  deleteCommentReplyHandler =async (req:Request, h: ResponseToolkit) => {
    const { username } = req.auth.credentials;
    const { threadId, replyId, commentId } = req.params;
    await this.deleteCommentReplyUseCase.execute({
      threadId, username: username as string, replyId, commentId: commentId as string
    });

    return h.response({
      status: "success"
    }).code(200);
  };
}