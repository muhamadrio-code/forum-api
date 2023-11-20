import { inject, injectable } from "tsyringe";
import AuthenticationRepository from "../../Domains/authentications/AuthenticationRepository";
import AuthenticationTokenManager from "../security/AuthenticationTokenManager";
import Validator from "../security/Validator";

@injectable()
export default class RefreshAuthenticationUseCase {
  private readonly authenticationRepository: AuthenticationRepository;
  private readonly authenticationTokenManager: AuthenticationTokenManager;
  private readonly validator: Validator;

  constructor(
    @inject("AuthenticationRepository") authenticationRepository: AuthenticationRepository,
    @inject("AuthenticationTokenManager") authenticationTokenManager: AuthenticationTokenManager,
    @inject("AuthenticationValidator") validator: Validator
  ) {
    this.authenticationRepository = authenticationRepository;
    this.authenticationTokenManager = authenticationTokenManager;
    this.validator = validator;
  }

  async execute(refreshToken: string) {
    this.validator.validatePayload(refreshToken);

    await this.authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.authenticationRepository.verifyToken(refreshToken);

    const { username, id } = await this.authenticationTokenManager.decodePayload(refreshToken);

    return await this.authenticationTokenManager.createAccessToken({ username, id });
  }
}