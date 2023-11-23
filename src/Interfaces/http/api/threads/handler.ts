import { Request, ResponseToolkit } from "@hapi/hapi";
import AddThreadUseCase from "../../../../Applications/use_cases/AddThreadUseCase";
import { ThreadPayload } from "../../../../Domains/entities/Thread";
import AddThreadCommentUseCase from "../../../../Applications/use_cases/AddThreadCommentUseCase";
import { AddedComment, CommentPayload } from "../../../../Domains/entities/Comment";

export default class ThreadHandler {
  private readonly addThreadUseCase: AddThreadUseCase;
  private readonly addThreadCommentUseCase: AddThreadCommentUseCase;

  constructor(
    addUserUseCase: AddThreadUseCase,
    addThreadCommentUseCase: AddThreadCommentUseCase
  ) {
    this.addThreadUseCase = addUserUseCase;
    this.addThreadCommentUseCase = addThreadCommentUseCase;
  }

  postThreadhandler = async (req: Request, h: ResponseToolkit) => {
    const { username } = req.auth.credentials;
    const { title, body }: ThreadPayload = req.payload as any;
    const { id, title: threadTitle, username: owner } = await this.addThreadUseCase.execute({
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
    });
  };
}