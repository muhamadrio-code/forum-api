import { inject, injectable } from "tsyringe";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import Validator from "../security/Validator";
import { AddThreadPayload, Thread } from "../../Domains/entities/Thread";
import { nanoid } from "nanoid";

@injectable()
export default class AddThreadUseCase {
  private readonly threadRepository: ThreadRepository;
  private readonly validator: Validator;

  constructor(
    @inject("ThreadRepository") threadRepository: ThreadRepository,
    @inject("ThreadValidator") validator: Validator
  ){
    this.threadRepository = threadRepository;
    this.validator = validator;
  }

  async execute({ title, body, username }:AddThreadPayload) {
    this.validator.validatePayload({ title, body });
    const newThread: Thread = {
      id: nanoid(16),
      title,
      body,
      username
    };
    return await this.threadRepository.addThread(newThread);
  }
}