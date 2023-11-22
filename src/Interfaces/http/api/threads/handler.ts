import { Request, ResponseToolkit } from "@hapi/hapi";
import AddThreadUseCase from "../../../../Applications/use_cases/AddThreadUseCase";
import { ThreadPayload } from "../../../../Domains/entities/Thread";

export default class ThreadHandler {
  private readonly addThreadUseCase: AddThreadUseCase;

  constructor(addUserUseCase: AddThreadUseCase) {
    this.addThreadUseCase = addUserUseCase;
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
}