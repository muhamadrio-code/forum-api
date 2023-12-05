import { CommentWithReplies } from "../../../Domains/comments/entities";
import { CommentReplyEntity } from "../../../Domains/replies/entities";
import { ThreadEntity } from "../../../Domains/threads/entities";
import GetThreadDetailsUseCase from "../GetThreadDetailsUseCase";

const ThreadRepository =
  jest.createMockFromModule<typeof import("../../../Domains/threads/ThreadRepository")>(
    "../../../Domains/threads/ThreadRepository"
  );
const ThreadCommentRepository =
  jest.createMockFromModule<typeof import("../../../Domains/comments/ThreadCommentsRepository")>(
    "../../../Domains/comments/ThreadCommentsRepository"
  );
const CommentReplyRepository =
  jest.createMockFromModule<typeof import("../../../Domains/replies/CommentReplyRepository")>(
    "../../../Domains/replies/CommentReplyRepository"
  );


describe('GetThreadDetailsUseCase', () => {
  let getThreadDetailsUseCase: GetThreadDetailsUseCase;

  beforeEach(() => {
    jest.resetAllMocks();

    const replies: CommentReplyEntity[] = [{
      id: 'reply-1',
      content: 'reply content',
      date: new Date().toISOString(),
      thread_id: 'thread_id-1',
      username: 'user-312',
      is_delete: false,
      comment_id: 'comment-1'
    }];

    const comments: CommentWithReplies[] = [{
      id: 'comment-1',
      content: 'comment content',
      date: new Date().toISOString(),
      thread_id: 'thread_id-1',
      username: 'user-32',
      is_delete: false,
      replies
    }];

    const thread: ThreadEntity = {
      id: '1',
      body: 'body',
      date: new Date().toISOString(),
      title: 'title',
      username: 'user-123'
    };

    ThreadRepository.default.prototype.getThreadById = jest.fn().mockResolvedValue(thread);
    ThreadCommentRepository.default.prototype.getCommentsByThreadId = jest.fn().mockResolvedValue(comments);
    CommentReplyRepository.default.prototype.getRepliesByCommentIds = jest.fn().mockResolvedValue({
      'comment-1': replies
    });

    getThreadDetailsUseCase = new GetThreadDetailsUseCase(
      ThreadRepository.default.prototype,
      CommentReplyRepository.default.prototype,
      ThreadCommentRepository.default.prototype,
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should successfully return thread details with comments', async () => {
    // Act
    const result = await getThreadDetailsUseCase.execute('1');

    // Assert
    expect(result).toStrictEqual({
      id: '1',
      body: 'body',
      comments: [{
        id: 'comment-1',
        content: 'comment content',
        date: expect.any(String),
        username: 'user-32',
        replies: [{
          id: 'reply-1',
          content: 'reply content',
          date: expect.any(String),
          username: 'user-312',
        }]
      }],
      date: expect.any(String),
      title: 'title',
      username: 'user-123'
    });
  });

  it('should successfully return thread details with empty comments', async () => {
    // Arange
    ThreadCommentRepository.default.prototype.getCommentsByThreadId = jest.fn().mockResolvedValue([]);

    // Act
    const result = await getThreadDetailsUseCase.execute('123');

    // Assert
    expect(result).toStrictEqual({
      id: '1',
      body: 'body',
      comments: [],
      date: expect.any(String),
      title: 'title',
      username: 'user-123'
    });
  });

  it('should replace the comment content if comment is deleted', async () => {
    // Arange
    ThreadCommentRepository.default.prototype.getCommentsByThreadId = jest.fn().mockResolvedValue([{
      id: 'comment-1',
      content: 'comment content',
      date: new Date().toISOString(),
      thread_id: 'thread_id-1',
      username: 'user-32',
      is_delete: true,
    }]);

    // Act
    const result = await getThreadDetailsUseCase.execute('1');

    // Assert
    expect(result).toStrictEqual({
      id: '1',
      body: 'body',
      comments: [{
        id: 'comment-1',
        content: '**komentar telah dihapus**',
        date: expect.any(String),
        username: 'user-32',
        replies: expect.any(Array)
      }],
      date: expect.any(String),
      title: 'title',
      username: 'user-123'
    });
  });

  it('should replace the replies content if replies is deleted', async () => {
    // Arange
    CommentReplyRepository.default.prototype.getRepliesByCommentIds = jest.fn().mockResolvedValue({
      'comment-1': [{
        id: 'reply-1',
        content: 'reply content',
        date: new Date().toISOString(),
        thread_id: 'thread_id-1',
        username: 'user-312',
        is_delete: true,
        comment_id: 'comment-1'
      }]
    });

    // Act
    const result = await getThreadDetailsUseCase.execute('123');

    // Assert
    expect(result).toStrictEqual({
      id: '1',
      body: 'body',
      comments: [{
        id: 'comment-1',
        content: 'comment content',
        date: expect.any(String),
        username: 'user-32',
        replies: [
          {
            id: 'reply-1',
            content: '**balasan telah dihapus**',
            date: expect.any(String),
            username: 'user-312',
          }
        ]
      }],
      date: expect.any(String),
      title: 'title',
      username: 'user-123'
    });
  });
});