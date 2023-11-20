import { inject, injectable } from 'tsyringe';
import InvariantError from '../../Common/Errors/InvariantError';
import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository';
import Validator from '../security/Validator';

@injectable()
export default class LogoutUserUseCase {
  private readonly authenticationRepository: AuthenticationRepository;
  private readonly validator: Validator;

  constructor(
    @inject("AuthenticationRepository") authenticationRepository: AuthenticationRepository,
    @inject("AuthenticationValidator") validator: Validator
  ) {
    this.authenticationRepository = authenticationRepository;
    this.validator = validator;
  }
  async execute(refreshToken: string) {
    this.validator.validatePayload(refreshToken);
    await this.authenticationRepository.verifyToken(refreshToken);
    const result = await this.authenticationRepository.deleteToken(refreshToken);
    if (!result) throw new InvariantError('Refresh token tidak valid');
  }
}