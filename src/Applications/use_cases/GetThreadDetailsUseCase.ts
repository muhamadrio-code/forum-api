import { inject, injectable } from "tsyringe";
import ThreadRepository from "../../Domains/threads/ThreadRepository";

@injectable()
export default class GetThreadDetailsUseCase {
  private readonly threadRepository: ThreadRepository;

  constructor(
    @inject("ThreadRepository") threadRepository: ThreadRepository,
  ){
    this.threadRepository = threadRepository;
  }

  async execute(threadId: string) {
    return await this.threadRepository.getThreadDetails(threadId);
  }
}