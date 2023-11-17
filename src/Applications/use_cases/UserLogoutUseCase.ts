import InvariantError from '../../Common/Errors/InvariantError';
import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository'

export default class LogoutUserUseCase {
  private readonly authenticationRepository: AuthenticationRepository;

  constructor(authenticationRepository: AuthenticationRepository) {
    this.authenticationRepository = authenticationRepository;
  }
  async execute(refreshToken: string) {
    const result = await this.authenticationRepository.deleteToken(refreshToken);
    if(!result) throw new InvariantError('Refresh token tidak valid');
  }
}