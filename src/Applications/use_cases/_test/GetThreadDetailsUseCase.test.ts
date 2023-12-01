import { ThreadDetailsEntity } from "../../../Domains/entities/Thread";
import GetThreadDetailsUseCase from "../GetThreadDetailsUseCase";

const ThreadRepository =
  jest.createMockFromModule<typeof import("../../../Domains/threads/ThreadRepository")>(
    "../../../Domains/threads/ThreadRepository"
  );


describe('GetThreadDetailsUseCase', () => {
  let getThreadDetailsUseCase: GetThreadDetailsUseCase;
  let threadDetails: ThreadDetailsEntity;

  beforeEach(() => {
    jest.resetAllMocks();

    threadDetails = {
      id:'1',
      body: 'body',
      comments: [{
        id: 'comment-1',
        content: 'comment content',
        date: new Date().toISOString(),
        thread_id: 'thread_id-1',
        username: 'user-32',
        is_delete: false,
        replies:[{
          id: 'reply-1',
          content: 'reply content',
          date: new Date().toISOString(),
          thread_id: 'thread_id-1',
          username: 'user-312',
          is_delete: false,
        }]
      }],
      date: new Date().toISOString(),
      title: 'title',
      username: 'user-123'
    };

    ThreadRepository.default.prototype.getThreadDetails = jest.fn().mockResolvedValue(threadDetails);

    getThreadDetailsUseCase = new GetThreadDetailsUseCase(
      ThreadRepository.default.prototype
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should successfully return ThreadDetails object with comments',async () => {
    // Act
    const result = await getThreadDetailsUseCase.execute('123');

    // Assert
    expect(result).toStrictEqual({
      id:'1',
      body: 'body',
      comments: [{
        id: 'comment-1',
        content: 'comment content',
        date: expect.any(String),
        thread_id: 'thread_id-1',
        username: 'user-32',
        replies:[{
          id: 'reply-1',
          content: 'reply content',
          date: expect.any(String),
          thread_id: 'thread_id-1',
          username: 'user-312',
        }]
      }],
      date: expect.any(String),
      title: 'title',
      username: 'user-123'
    });
  });

  it('should successfully return ThreadDetails object with null comments',async () => {
    // Arange
    ThreadRepository.default.prototype.getThreadDetails = jest.fn().mockResolvedValue({
      id:'1',
      body: 'body',
      comments: null,
      date: expect.any(String),
      title: 'title',
      username: 'user-123'
    });

    // Act
    const result = await getThreadDetailsUseCase.execute('123');

    // Assert
    expect(result).toStrictEqual({
      id:'1',
      body: 'body',
      comments: null,
      date: expect.any(String),
      title: 'title',
      username: 'user-123'
    });
  });

  it('should replace the comment content if comment is deleted',async () => {
    // Arange
    ThreadRepository.default.prototype.getThreadDetails = jest.fn().mockResolvedValue({
      id:'1',
      body: 'body',
      comments: [{
        id: 'comment-1',
        content: 'comment content',
        date: new Date().toISOString(),
        thread_id: 'thread_id-1',
        username: 'user-32',
        is_delete: true,
        replies:[]
      }],
      date: new Date().toISOString(),
      title: 'title',
      username: 'user-123'
    });

    // Act
    const result = await getThreadDetailsUseCase.execute('123');

    // Assert
    expect(result).toStrictEqual({
      id:'1',
      body: 'body',
      comments: [{
        id: 'comment-1',
        content: '**komentar telah dihapus**',
        date: expect.any(String),
        thread_id: 'thread_id-1',
        username: 'user-32',
        replies:[]
      }],
      date: expect.any(String),
      title: 'title',
      username: 'user-123'
    });
  });

  it('should replace the replies content if replies is deleted',async () => {
    // Arange
    ThreadRepository.default.prototype.getThreadDetails = jest.fn().mockResolvedValue({
      id:'1',
      body: 'body',
      comments: [
        {
          id: 'comment-1',
          content: 'comment content',
          date: new Date().toISOString(),
          thread_id: 'thread_id-1',
          username: 'user-32',
          is_delete: false,
          replies:[
            {
              id: 'reply-2',
              content: 'reply content',
              date: new Date().toISOString(),
              thread_id: 'thread_id-1',
              username: 'user-32',
              is_delete: true,
            },
            {
              id: 'reply-3',
              content: 'reply content',
              date: new Date().toISOString(),
              thread_id: 'thread_id-1',
              username: 'user-52',
              is_delete: true,
            }
          ]
        }],
      date: new Date().toISOString(),
      title: 'title',
      username: 'user-123'
    });

    // Act
    const result = await getThreadDetailsUseCase.execute('123');

    // Assert
    expect(result).toStrictEqual({
      id:'1',
      body: 'body',
      comments: [{
        id: 'comment-1',
        content: 'comment content',
        date: expect.any(String),
        thread_id: 'thread_id-1',
        username: 'user-32',
        replies:[
          {
            id: 'reply-2',
            content: '**balasan telah dihapus**',
            date: expect.any(String),
            thread_id: 'thread_id-1',
            username: 'user-32',
          },
          {
            id: 'reply-3',
            content: '**balasan telah dihapus**',
            date: expect.any(String),
            thread_id: 'thread_id-1',
            username: 'user-52',
          }
        ]
      }],
      date: expect.any(String),
      title: 'title',
      username: 'user-123'
    });
  });
});