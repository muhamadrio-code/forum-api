import { inject, injectable } from "tsyringe";
import ThreadCommentRepository from "../../Domains/comments/ThreadCommentsRepository";
import UserRepository from "../../Domains/users/UserRepository";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import ClientError from "../../Common/Errors/ClientError";
import CommentReplyRepository from "../../Domains/replies/CommentReplyRepository";

@injectable()
export default class DeleteCommentReplyUseCase {
  private readonly threadCommentsRepository: ThreadCommentRepository;
  private readonly usersRepository: UserRepository;
  private readonly threadRepository: ThreadRepository;
  private readonly replyRepository: CommentReplyRepository;

  constructor(
    @inject("ThreadCommentsRepository") threadCommentsRepository: ThreadCommentRepository,
    @inject("UserRepository") userRepository: UserRepository,
    @inject("ThreadRepository") threadRepository: ThreadRepository,
    @inject("CommentReplyRepository") replyRepository: CommentReplyRepository,
  ) {
    this.threadCommentsRepository = threadCommentsRepository;
    this.usersRepository = userRepository;
    this.threadRepository = threadRepository;
    this.replyRepository = replyRepository;
  }

  async execute(payload: { replyId: string, username: string, threadId: string, commentId: string }) {
    const [reply] = await Promise.all([
      this.replyRepository.getReplyById(payload.replyId),
      this.usersRepository.getUserByUsername(payload.username),
      this.threadRepository.getThreadById(payload.threadId),
      this.threadCommentsRepository.getCommentById(payload.commentId)
    ]);

    if (payload.username !== reply.username) throw new ClientError("Forbidden", 403);

    await this.replyRepository.deleteReplyById(payload.replyId);
  }
}