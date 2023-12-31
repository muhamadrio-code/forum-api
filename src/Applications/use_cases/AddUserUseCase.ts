import UserRepository from "../../Domains/users/UserRepository";
import PasswordHash from "../security/PasswordHash";
import { UserPayload } from "../../Domains/users/entities";
import Validator from "../security/Validator";
import { randomUUID } from "crypto";
import { inject, injectable } from "tsyringe";


@injectable()
export default class AddUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly validator: Validator;
  private readonly passwordHash: PasswordHash;

  constructor(
    @inject("UserRepository") userRepository: UserRepository,
    @inject("UserValidator") validator: Validator,
    @inject("PasswordHash") passwordHash: PasswordHash
  ) {
    this.userRepository = userRepository;
    this.validator = validator;
    this.passwordHash = passwordHash;
  }

  async execute(payload: UserPayload) {
    this.validator.validatePayload(payload);
    await this.userRepository.verifyUsernameAvailability(payload.username);

    const id = randomUUID();
    const hashedPassword = await this.passwordHash.hash(payload.password);
    return await this.userRepository.addUser({
      id,
      ...payload,
      password: hashedPassword,
    });
  }
}