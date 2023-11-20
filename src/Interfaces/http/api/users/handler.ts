import { Request, ResponseToolkit } from "@hapi/hapi";
import AddUserUseCase from "../../../../Applications/use_cases/AddUserUseCase";

export default class UserHandler {
  private readonly addUserUseCase: AddUserUseCase;

  constructor(addUserUseCase: AddUserUseCase) {
    this.addUserUseCase = addUserUseCase;
  }

  postUserhandler = async (req: Request, h: ResponseToolkit) => {
    const { fullname, username, password } = req.payload as any;
    const registeredUser = await this.addUserUseCase.execute({ fullname, username, password });
    return h.response({
      status: 'success',
      data: {
        addedUser: registeredUser
      }
    }).code(201);
  };
}