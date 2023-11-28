import { inject, injectable } from "tsyringe";
import ThreadCommentRepository from "../../Domains/comments/ThreadCommentsRepository";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import UserRepository from "../../Domains/users/UserRepository";
import ClientError from "../../Common/Errors/ClientError";

@injectable()
export default class DeleteThreadCommentUseCase {
  private readonly threadCommentsRepository: ThreadCommentRepository;
  private readonly usersRepository: UserRepository;
  private readonly threadRepository: ThreadRepository;

  constructor(
    @inject("ThreadCommentsRepository") threadCommentsRepository: ThreadCommentRepository,
    @inject("UserRepository") userRepository: UserRepository,
    @inject("ThreadRepository") threadRepository: ThreadRepository,
  ){
    this.threadCommentsRepository = threadCommentsRepository;
    this.usersRepository = userRepository;
    this.threadRepository = threadRepository;
  }

  async execute(payload: { commentId:string, username: string, threadId:string }) {
    const user = await this.usersRepository.getUserByUsername(payload.username);
    const thread = await this.threadRepository.getThreadById(payload.threadId);
    if(user.username !== thread.username) throw new ClientError("Forbidden", 403);

    return await this.threadCommentsRepository.deleteComment(payload.commentId);
  }
}