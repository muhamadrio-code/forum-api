import { inject, injectable } from "tsyringe";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import { ThreadDetailsEntity } from "../../Domains/entities/Thread";

@injectable()
export default class GetThreadDetailsUseCase {
  private readonly threadRepository: ThreadRepository;

  constructor(
    @inject("ThreadRepository") threadRepository: ThreadRepository
  ) {
    this.threadRepository = threadRepository;
  }

  async execute(threadId: string) {
    const threadDetails = await this.threadRepository.getThreadDetails(threadId);
    const [newComments, newReplies] = await Promise.all([
      threadDetails.comments?.map((comment) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { is_delete, content, ...rest } = comment;
        if (comment.is_delete === true) {
          return {
            content: "**komentar telah dihapus**",
            ...rest
          };
        }

        return { content: comment.content, ...rest };
      }),
      threadDetails.comments
        ?.map((comment) => comment.replies)
        .map((replies) => replies.map((reply) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { is_delete, content, ...rest } = reply;
          if (reply.is_delete === true) {
            return {
              content: "**balasan telah dihapus**",
              ...rest
            };
          }

          return { content: reply.content, ...rest };
        })) ?? []
    ]);

    const commentWithReplies = newComments?.map((comment, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { replies, ...rest } = comment;
      return {
        ...rest,
        replies: newReplies[index]
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { comments, ...rest } = threadDetails;
    return {
      ...rest,
      comments: commentWithReplies ?? null
    } as ThreadDetailsEntity;
  }
}