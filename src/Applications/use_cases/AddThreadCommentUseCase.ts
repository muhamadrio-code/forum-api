import { inject, injectable } from "tsyringe";
import ThreadCommentRepository from "../../Domains/comments/ThreadCommentsRepository";
import Validator from "../security/Validator";
import { Comment, CommentUseCasePayload } from "../../Domains/comments/entities";
import { nanoid } from "nanoid";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import UserRepository from "../../Domains/users/UserRepository";


@injectable()
export default class AddThreadCommentUseCase {
  private readonly threadCommentsRepository: ThreadCommentRepository;
  private readonly validator: Validator;
  private readonly usersRepository: UserRepository;
  private readonly threadRepository: ThreadRepository;

  constructor(
    @inject("ThreadCommentsRepository") threadCommentsRepository: ThreadCommentRepository,
    @inject("UserRepository") userRepository: UserRepository,
    @inject("ThreadRepository") threadRepository: ThreadRepository,
    @inject("CommentValidator") validator: Validator
  ){
    this.threadCommentsRepository = threadCommentsRepository;
    this.usersRepository = userRepository;
    this.threadRepository = threadRepository;
    this.validator = validator;
  }

  async execute({ content, username, thread_id }: CommentUseCasePayload) {
    await Promise.all([
      Promise.resolve(this.validator.validatePayload({ content })),
      this.usersRepository.getUserByUsername(username),
      this.threadRepository.getThreadById(thread_id)
    ]);

    const newComment: Comment = {
      id: nanoid(16),
      thread_id: thread_id,
      content,
      username
    };
    return await this.threadCommentsRepository.addComment(newComment);
  }
}