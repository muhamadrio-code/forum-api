import AuthenticationError from "../../Common/Errors/AuthenticationError";
import AuthenticationRepository from "../../Domains/authentications/AuthenticationRepository";
import { AuthenticationTokens, UserLoginPayload } from "../../Domains/entities/definitions";
import UserRepository from "../../Domains/users/UserRepository";
import AuthenticationTokenManager from "../security/AuthenticationTokenManager";
import PasswordHash from "../security/PasswordHash";
import Validator from "../security/Validator";

export default class UserLoginUseCase {
  private readonly validator: Validator;
  private readonly userRepository: UserRepository;
  private readonly authenticationRepository: AuthenticationRepository;
  private readonly passwordHash: PasswordHash;
  private readonly authenticationTokenManager: AuthenticationTokenManager

  constructor(
    validator: Validator, 
    userRepository: UserRepository, 
    authenticationRepository: AuthenticationRepository,
    passwordHash: PasswordHash,
    authenticationTokenManager: AuthenticationTokenManager
  ) {
    this.validator = validator
    this.userRepository = userRepository
    this.authenticationRepository = authenticationRepository
    this.passwordHash = passwordHash
    this.authenticationTokenManager = authenticationTokenManager
  }

  async execute(payload: UserLoginPayload): Promise<AuthenticationTokens> {
    const { username, password } = this.validator.validatePayload(payload)
    const encryptedPassword = await this.userRepository.getUserPasswordByUsername(username)

    const compareResult = await this.passwordHash.comparePassword(password, encryptedPassword)
    if(!compareResult) throw new AuthenticationError("Password tidak sesuai")

    const id = await this.userRepository.getIdByUsername(username)
    const accessToken =  await this.authenticationTokenManager.createAccessToken({ id, username })
    const refreshToken = await this.authenticationTokenManager.createRefreshToken({ id, username })

    await this.authenticationRepository.addToken(refreshToken)
    return {
      accessToken,
      refreshToken
    }
  }
}