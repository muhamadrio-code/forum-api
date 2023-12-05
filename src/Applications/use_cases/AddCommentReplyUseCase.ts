import { inject, injectable } from "tsyringe";
import ThreadCommentRepository from "../../Domains/comments/ThreadCommentsRepository";
import Validator from "../security/Validator";
import { nanoid } from "nanoid";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import UserRepository from "../../Domains/users/UserRepository";
import CommentReplyRepository from "../../Domains/replies/CommentReplyRepository";
import { AddReplyUseCasePayload, CommentReply } from "../../Domains/replies/entities";

@injectable()
export default class AddCommentReplyuseCase {
  private readonly threadCommentsRepository: ThreadCommentRepository;
  private readonly validator: Validator;
  private readonly usersRepository: UserRepository;
  private readonly threadRepository: ThreadRepository;
  private readonly replyRepository: CommentReplyRepository;

  constructor(
    @inject("ThreadCommentsRepository") threadCommentsRepository: ThreadCommentRepository,
    @inject("UserRepository") userRepository: UserRepository,
    @inject("ThreadRepository") threadRepository: ThreadRepository,
    @inject("CommentValidator") validator: Validator,
    @inject("CommentReplyRepository") replyRepository: CommentReplyRepository,
  ) {
    this.threadCommentsRepository = threadCommentsRepository;
    this.usersRepository = userRepository;
    this.threadRepository = threadRepository;
    this.validator = validator;
    this.replyRepository = replyRepository;
  }

  async execute({ content, username, thread_id, comment_id }: AddReplyUseCasePayload) {
    await Promise.all([
      this.validator.validatePayload({ content }),
      this.usersRepository.getUserByUsername(username),
      this.threadRepository.getThreadById(thread_id),
      this.threadCommentsRepository.getCommentById(comment_id)
    ]);

    const reply: CommentReply = {
      id: nanoid(16),
      thread_id,
      content,
      username,
      comment_id
    };
    return await this.replyRepository.addReply(reply);
  }
}