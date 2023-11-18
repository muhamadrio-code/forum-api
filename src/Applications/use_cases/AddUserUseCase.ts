import UserRepository from "../../Domains/users/UserRepository";
import PasswordHash from "../security/PasswordHash";
import { UserPayload } from "../../Domains/entities/definitions";
import Validator from "../security/Validator";
import { randomUUID } from "crypto";
import { inject, injectable } from "tsyringe";

@injectable()
export default class AddUserUseCase {
  private readonly userRepository: UserRepository
  private readonly validator: Validator
  private readonly passwordHash: PasswordHash

  constructor(
    @inject("UserRepositoryPostgres") userRepository: UserRepository,
    @inject("UserValidator") validator: Validator,
    @inject("BCryptPasswordHash") passwordHash: PasswordHash
  ) {
    this.userRepository = userRepository
    this.validator = validator
    this.passwordHash = passwordHash
  }

  async execute(payload: UserPayload) {
    const result = this.validator.validatePayload(payload)
    const id = randomUUID()
    const hashedPassword = await this.passwordHash.hash(result.password)
    return await this.userRepository.addUser({
      id,
      ...result,
      password: hashedPassword,
    })
  }
}