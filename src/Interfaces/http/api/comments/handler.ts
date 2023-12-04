import { Request, ResponseToolkit } from "@hapi/hapi";
import AddThreadCommentUseCase from "../../../../Applications/use_cases/AddThreadCommentUseCase";
import { AddedComment, CommentPayload, DeletedComment } from "../../../../Domains/comments/entities";
import InvariantError from "../../../../Common/Errors/InvariantError";
import DeleteThreadCommentUseCase from "../../../../Applications/use_cases/DeleteThreadCommentUseCase";

export default class ThreadCommentHandler {
  private readonly addThreadCommentUseCase: AddThreadCommentUseCase;
  private readonly deleteThreadCommentUseCase: DeleteThreadCommentUseCase;

  constructor(
    addThreadCommentUseCase: AddThreadCommentUseCase,
    deleteThreadCommentUseCase: DeleteThreadCommentUseCase,
  ) {
    this.addThreadCommentUseCase = addThreadCommentUseCase;
    this.deleteThreadCommentUseCase = deleteThreadCommentUseCase;
  }

  postThreadCommenthandler = async (req: Request, h: ResponseToolkit) => {
    const { username } = req.auth.credentials;
    if(req.payload === null) throw new InvariantError("Bad Request");

    const { content }: CommentPayload = req.payload as any;
    const { threadId } = req.params;
    const { content: addedContent, id, owner }: AddedComment =
      await this.addThreadCommentUseCase.execute({ content, username: username as string, thread_id: threadId });

    return h.response({
      status: "success",
      data: {
        addedComment: {
          id,
          content: addedContent,
          owner
        }
      }
    }).code(201);
  };

  deleteThreadCommenthandler = async (req:Request, h: ResponseToolkit) => {
    const { username } = req.auth.credentials;
    const { threadId, commentId }: Record<string, string> = req.params;
    const { content }: DeletedComment = await this.deleteThreadCommentUseCase.execute({ threadId, commentId, username: username as string });

    return h.response({
      status: 'success',
      content
    }).code(200);
  };
}