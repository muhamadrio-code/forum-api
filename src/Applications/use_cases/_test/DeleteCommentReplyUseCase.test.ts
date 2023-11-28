import DeleteThreadCommentReplyUseCase from "../DeleteCommentReplyUseCase";

const UserRepository =
  jest.createMockFromModule<typeof import("../../../Domains/users/UserRepository")>("../../../Domains/users/UserRepository");
const ThreadRepository =
  jest.createMockFromModule<typeof import("../../../Domains/threads/ThreadRepository")>("../../../Domains/threads/ThreadRepository");
const ThreadCommentsRepository =
  jest.createMockFromModule<typeof import("../../../Domains/comments/ThreadCommentsRepository")>("../../../Domains/comments/ThreadCommentsRepository");

describe('AddThreadCommentUseCase', () => {
  let useCase: DeleteThreadCommentReplyUseCase;

  beforeEach(() => {
    jest.resetAllMocks();

    UserRepository.default.prototype.getUserByUsername = jest.fn().mockResolvedValue({username: 'testuser'});
    ThreadRepository.default.prototype.verifyThreadAvaibility = jest.fn();
    ThreadCommentsRepository.default.prototype.getCommentById = jest.fn().mockResolvedValue({username: 'testuser'});
    ThreadCommentsRepository.default.prototype.getCommentReplyById = jest.fn().mockResolvedValue({username: 'testuser'});
    ThreadCommentsRepository.default.prototype.deleteComment = jest.fn();

    useCase = new DeleteThreadCommentReplyUseCase(
      ThreadCommentsRepository.default.prototype,
      UserRepository.default.prototype,
      ThreadRepository.default.prototype,
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it("should successfully delete reply", async () => {
    // Arrange
    const username = 'testuser';
    const threadId = '123';
    const replyId = '456';
    const commentId = '21';

    // Act
    await useCase.execute({ username, threadId, replyId, commentId });

    // Assert
    expect(ThreadCommentsRepository.default.prototype.deleteComment).toHaveBeenCalledWith(replyId);
  });

  it("should validate the username is valid before proceeding", async () => {
    // Arrange
    const username = 'testuser';
    const threadId = '123';
    const replyId = '456';
    const commentId = '21';

    // Act
    await useCase.execute({ username, threadId, replyId, commentId });

    // Assert
    expect(UserRepository.default.prototype.getUserByUsername).toHaveBeenCalledWith(username);
  });

  it("should validate that thread is exist before proceeding", async () => {
    // Arrange
    const username = 'testuser';
    const threadId = '123';
    const replyId = '456';
    const commentId = '21';

    // Act
    await useCase.execute({ username, threadId, replyId, commentId });

    // Assert
    expect(ThreadRepository.default.prototype.verifyThreadAvaibility).toHaveBeenCalledWith(threadId);
  });

  it("should validate that comment is exist before proceeding", async () => {
    // Arrange
    const username = 'testuser';
    const threadId = '123';
    const commentId = '21';
    const replyId = '456';

    // Act
    await useCase.execute({ username, threadId, replyId, commentId });

    // Assert
    expect(ThreadCommentsRepository.default.prototype.getCommentById).toHaveBeenCalledWith(commentId);
  });

  it("should validate that reply is exist before proceeding", async () => {
    // Arrange
    const username = 'testuser';
    const threadId = '123';
    const commentId = '21';
    const replyId = '456';

    // Act
    await useCase.execute({ username, threadId, replyId, commentId });

    // Assert
    expect(ThreadCommentsRepository.default.prototype.getCommentReplyById).toHaveBeenCalledWith(replyId);
  });

  it("should throw error if user 'testuser' try to delete 'Ririka' reply ", async () => {
    // Arrange
    const username = 'testuser';
    const threadId = '123';
    const commentId = '21';
    const replyId = '456';
    ThreadCommentsRepository.default.prototype.getCommentReplyById = jest.fn().mockResolvedValue({username: 'Ririka'});

    // Act & Assert
    await expect(useCase.execute({ username, threadId, replyId, commentId })).rejects.toThrow();
  });
});
