import { Request, ResponseToolkit } from "@hapi/hapi";
import AddThreadUseCase from "../../../../Applications/use_cases/AddThreadUseCase";
import { ThreadPayload } from "../../../../Domains/threads/entities";
import InvariantError from "../../../../Common/Errors/InvariantError";
import GetThreadDetailsUseCase from "../../../../Applications/use_cases/GetThreadDetailsUseCase";

export default class ThreadHandler {
  private readonly addThreadUseCase: AddThreadUseCase;
  private readonly getThreadDetailsUseCase: GetThreadDetailsUseCase;

  constructor(
    addUserUseCase: AddThreadUseCase,
    getThreadDetailsUseCase: GetThreadDetailsUseCase,
  ) {
    this.addThreadUseCase = addUserUseCase;
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