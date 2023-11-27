import { Request, ResponseToolkit } from "@hapi/hapi";
import AddThreadUseCase from "../../../../Applications/use_cases/AddThreadUseCase";
import { ThreadPayload } from "../../../../Domains/entities/Thread";
import AddThreadCommentUseCase from "../../../../Applications/use_cases/AddThreadCommentUseCase";
import { AddedComment, CommentPayload, DeletedComment } from "../../../../Domains/entities/Comment";
import InvariantError from "../../../../Common/Errors/InvariantError";
import DeleteThreadCommentUseCase from "../../../../Applications/use_cases/DeleteThreadCommentUseCase";
import GetThreadDetailsUseCase from "../../../../Applications/use_cases/GetThreadDetailsUseCase";
import AddCommentReplyUseCase from "../../../../Applications/use_cases/AddCommentReplyUseCase";
import DeleteThreadCommentReplyUseCase from "../../../../Applications/use_cases/DeleteCommentReplyUseCase";

export default class ThreadHandler {
  private readonly addThreadUseCase: AddThreadUseCase;
  private readonly addThreadCommentUseCase: AddThreadCommentUseCase;
  private readonly deleteThreadCommentUseCase: DeleteThreadCommentUseCase;
  private readonly getThreadDetailsUseCase: GetThreadDetailsUseCase;
  private readonly addCommentReplyUseCase: AddCommentReplyUseCase;
  private readonly deleteCommentReplyUseCase: DeleteThreadCommentReplyUseCase;

  constructor(
    addUserUseCase: AddThreadUseCase,
    addThreadCommentUseCase: AddThreadCommentUseCase,
    deleteThreadCommentUseCase: DeleteThreadCommentUseCase,
    getThreadDetailsUseCase: GetThreadDetailsUseCase,
    addCommentReplyUseCase: AddCommentReplyUseCase,
    deleteCommentReplyUseCase: DeleteThreadCommentReplyUseCase,
  ) {
    this.addThreadUseCase = addUserUseCase;
    this.addThreadCommentUseCase = addThreadCommentUseCase;
    this.deleteThreadCommentUseCase = deleteThreadCommentUseCase;
    this.getThreadDetailsUseCase = getThreadDetailsUseCase;
    this.addCommentReplyUseCase = addCommentReplyUseCase;
    this.deleteCommentReplyUseCase = deleteCommentReplyUseCase;
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
      await this.addThreadCommentUseCase.execute({ content, username: username as string, threadId: threadId });

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

  postCommentReplyHandler = async (req:Request, h: ResponseToolkit) => {
    if(req.payload === null) throw new InvariantError("Bad Request");
    const { username } = req.auth.credentials;
    const { threadId, commentId }: Record<string, string> = req.params;

    const { content }: CommentPayload = req.payload as any;
    const { content: addedContent, id, owner }: AddedComment =
      await this.addCommentReplyUseCase.execute({ content, username:username as string, threadId, replyTo: commentId });
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
    const { threadId, replyId } = req.params;
    await this.deleteCommentReplyUseCase.execute({ threadId, username: username as string, replyId });

    return h.response({
      status: "success"
    }).code(200);
  };
}