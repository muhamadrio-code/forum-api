import { Request, ResponseToolkit } from "@hapi/hapi";
import UserLogoutUseCase from "../../../../Applications/use_cases/UserLogoutUseCase";
import UserLoginUseCase from "../../../../Applications/use_cases/UserLoginUseCase";
import RefreshAuthenticationUseCase from "../../../../Applications/use_cases/RefreshAuthenticationUseCase";
import { UserLoginPayload } from "../../../../Domains/entities/definitions";
import { injectable, inject } from "tsyringe";


@injectable()
export default class AuthenticationHandler {
  private readonly userLoginUseCase: UserLoginUseCase
  private readonly userLogoutUseCase: UserLogoutUseCase
  private readonly refreshAuthenticationUseCase: RefreshAuthenticationUseCase

  constructor(
    @inject("UserLoginUseCase") userLoginUseCase: UserLoginUseCase,
    @inject("UserLogoutUseCase") userLogoutUseCase: UserLogoutUseCase,
    @inject("RefreshAuthenticationUseCase") refreshAuthenticationUseCase: RefreshAuthenticationUseCase
  ) {
    this.userLoginUseCase = userLoginUseCase
    this.refreshAuthenticationUseCase = refreshAuthenticationUseCase
    this.userLogoutUseCase = userLogoutUseCase
  }

  postAuthenticationHandler = async (req: Request, h: ResponseToolkit) => {
    const { accessToken, refreshToken } = await this.userLoginUseCase.execute(req.payload as UserLoginPayload);
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  putAuthenticationHandler = async (req: Request) => {
    const { refreshToken } = req.payload as any;
    const accessToken = await this.refreshAuthenticationUseCase.execute(refreshToken);

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  deleteAuthenticationHandler = async (req: Request) => {
    const { refreshToken } = req.payload as any;
    await this.userLogoutUseCase.execute(refreshToken);
    return {
      status: 'success',
    };
  }
}