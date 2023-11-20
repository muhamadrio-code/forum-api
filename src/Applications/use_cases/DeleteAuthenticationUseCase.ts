import AuthenticationRepository from "../../Domains/authentications/AuthenticationRepository";
import Validator from "../security/Validator";

export default class DeleteAuthenticationUseCase {
  private readonly authenticationRepository: AuthenticationRepository;
  private readonly validator: Validator;

  constructor(
    authenticationRepository: AuthenticationRepository,
    validator: Validator
  ) {
    this.authenticationRepository = authenticationRepository;
    this.validator = validator;
  }

  async execute(refreshToken: string) {
    this.validator.validatePayload(refreshToken);
    await this.authenticationRepository.verifyToken(refreshToken);
    await this.authenticationRepository.deleteToken(refreshToken);
  }
}