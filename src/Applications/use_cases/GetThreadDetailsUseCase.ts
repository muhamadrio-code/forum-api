import { inject, injectable } from "tsyringe";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import { ThreadDetailsEntity } from "../../Domains/threads/entities";
import ThreadCommentRepository from "../../Domains/comments/ThreadCommentsRepository";
import CommentReplyRepository from "../../Domains/replies/CommentReplyRepository";
import { CommentReplyEntity } from "../../Domains/replies/entities";

@injectable()
export default class GetThreadDetailsUseCase {
  private readonly threadRepository: ThreadRepository;
  private readonly commentRepository: ThreadCommentRepository;
  private readonly replyRepository: CommentReplyRepository;


  constructor(
    @inject("ThreadRepository") threadRepository: ThreadRepository,
    @inject("CommentReplyRepository") replyRepository: CommentReplyRepository,
    @inject("ThreadCommentsRepository") commentRepository: ThreadCommentRepository,
  ) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(threadId: string) {
    const [thread, comments] = await Promise.all([
      this.threadRepository.getThreadById(threadId),
      this.commentRepository.getCommentsByThreadId(threadId)
    ]);

    const commentIds = comments.map((comment) => (comment.id));
    const replies: { [comment_id: string]: CommentReplyEntity[] } =
      await this.replyRepository.getRepliesByCommentIds(commentIds);

    const [newReplies, newComments] = await Promise.all([
      getNewReplies(),
      getNewComments()
    ]);

    function getNewReplies() {
      const newReplies: {
        [comment_id: string]: Omit<CommentReplyEntity, 'is_delete' | 'thread_id' | 'comment_id'>[]
      } = {};

      for (const key in replies) {
        newReplies[key] = replies[key].map((reply) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { is_delete, content, thread_id, comment_id, ...replyRest } = reply;
          if (reply.is_delete === true) {
            return {
              content: "**balasan telah dihapus**",
              ...replyRest
            };
          }

          return { content: reply.content, ...replyRest };
        });
      }
      return newReplies;
    }

    function getNewComments() {
      return comments.map((comment) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { is_delete, content, thread_id, ...rest } = comment;
        if (comment.is_delete === true) {
          return {
            content: "**komentar telah dihapus**",
            ...rest,
          };
        }

        return {
          content: comment.content,
          ...rest,
        };
      });
    }

    const commentWithReplies = newComments.map((comment) => {
      return {
        ...comment,
        replies: newReplies[comment.id] ?? []
      };
    });

    return {
      ...thread,
      comments: commentWithReplies
    } as ThreadDetailsEntity;
  }
}