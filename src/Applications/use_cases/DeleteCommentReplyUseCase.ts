import { inject, injectable } from "tsyringe";
import ThreadCommentRepository from "../../Domains/comments/ThreadCommentsRepository";
import UserRepository from "../../Domains/users/UserRepository";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import ClientError from "../../Common/Errors/ClientError";

@injectable()
export default class DeleteThreadCommentReplyUseCase {
  private readonly threadCommentsRepository: ThreadCommentRepository;
  private readonly usersRepository: UserRepository;
  private readonly threadRepository: ThreadRepository;

  constructor(
    @inject("ThreadCommentsRepository") threadCommentsRepository: ThreadCommentRepository,
    @inject("UserRepository") userRepository: UserRepository,
    @inject("ThreadRepository") threadRepository: ThreadRepository,
  ) {
    this.threadCommentsRepository = threadCommentsRepository;
    this.usersRepository = userRepository;
    this.threadRepository = threadRepository;
  }

  async execute(payload: { replyId: string, username: string, threadId: string }) {
    const user = await this.usersRepository.getUserByUsername(payload.username);
    await this.threadRepository.getThreadById(payload.threadId);
    const reply = await this.threadCommentsRepository.getCommentById(payload.replyId);
    if (user.username !== reply.username) throw new ClientError("Forbidden", 403);

    await this.threadCommentsRepository.deleteComment(payload.replyId);
  }
}