import { Request, ResponseToolkit } from "@hapi/hapi";
import AddThreadUseCase from "../../../../Applications/use_cases/AddThreadUseCase";
import { ThreadPayload } from "../../../../Domains/entities/Thread";
import AddThreadCommentUseCase from "../../../../Applications/use_cases/AddThreadCommentUseCase";
import { AddedComment, CommentPayload } from "../../../../Domains/entities/Comment";
import InvariantError from "../../../../Common/Errors/InvariantError";
import DeleteThreadCommentUseCase from "../../../../Applications/use_cases/DeleteThreadCommentUseCase";
import GetThreadDetailsUseCase from "../../../../Applications/use_cases/GetThreadDetailsUseCase";

export default class ThreadHandler {
  private readonly addThreadUseCase: AddThreadUseCase;
  private readonly addThreadCommentUseCase: AddThreadCommentUseCase;
  private readonly deleteThreadCommentUseCase: DeleteThreadCommentUseCase;
  private readonly getThreadDetailsUseCase: GetThreadDetailsUseCase;

  constructor(
    addUserUseCase: AddThreadUseCase,
    addThreadCommentUseCase: AddThreadCommentUseCase,
    deleteThreadCommentUseCase: DeleteThreadCommentUseCase,
    getThreadDetailsUseCase: GetThreadDetailsUseCase
  ) {
    this.addThreadUseCase = addUserUseCase;
    this.addThreadCommentUseCase = addThreadCommentUseCase;
    this.deleteThreadCommentUseCase = deleteThreadCommentUseCase;
    this.getThreadDetailsUseCase = getThreadDetailsUseCase;
  }

  postThreadhandler = async (req: Request, h: ResponseToolkit) => {
    const { username } = req.auth.credentials;
    if(req.payload === null) throw new InvariantError("Bad Request");

    const { title, body }: ThreadPayload = req.payload as any;
    const { id, title: threadTitle, owner } = await this.addThreadUseCase.execute({
      title, body, username: username as string,
    });

    return h.response({
      status: 'success',
      data: {
        addedThread: {
          id, title: threadTitle, owner
        }
      }
    }).code(201);
  };

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
    const deletedComment = await this.deleteThreadCommentUseCase.execute({ threadId, commentId, username: username as string });

    return h.response(deletedComment).code(200);
  };

  getThreadDetailsHandler = async (req:Request, h: ResponseToolkit) => {
    const { threadId }: Record<string, string> = req.params;
    const threadDetails = await this.getThreadDetailsUseCase.execute(threadId);

    return h.response({
      status: 'success',
      data: {
        thread: threadDetails
      }
    });
  };
}