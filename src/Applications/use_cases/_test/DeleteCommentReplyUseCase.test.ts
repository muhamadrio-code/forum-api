import DeleteCommentReplyUseCase from "../DeleteCommentReplyUseCase";

const UserRepository =
  jest.createMockFromModule<typeof import("../../../Domains/users/UserRepository")>("../../../Domains/users/UserRepository");
const ThreadRepository =
  jest.createMockFromModule<typeof import("../../../Domains/threads/ThreadRepository")>("../../../Domains/threads/ThreadRepository");
const ThreadCommentsRepository =
  jest.createMockFromModule<typeof import("../../../Domains/comments/ThreadCommentsRepository")>("../../../Domains/comments/ThreadCommentsRepository");
  const CommentReplyRepository =
  jest.createMockFromModule<typeof import("../../../Domains/replies/CommentReplyRepository")>("../../../Domains/replies/CommentReplyRepository");

describe('DeleteCommentReplyUseCase', () => {
  let useCase: DeleteCommentReplyUseCase;

  beforeEach(() => {
    jest.resetAllMocks();

    UserRepository.default.prototype.getUserByUsername = jest.fn().mockResolvedValue({username: 'testuser'});
    ThreadRepository.default.prototype.getThreadById = jest.fn();
    ThreadCommentsRepository.default.prototype.getCommentById = jest.fn().mockResolvedValue({username: 'testuser'});
    CommentReplyRepository.default.prototype.getReplyById = jest.fn().mockResolvedValue({username: 'testuser'});
    CommentReplyRepository.default.prototype.deleteReplyById = jest.fn();

    useCase = new DeleteCommentReplyUseCase(
      ThreadCommentsRepository.default.prototype,
      UserRepository.default.prototype,
      ThreadRepository.default.prototype,
      CommentReplyRepository.default.prototype
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
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
    expect(ThreadRepository.default.prototype.getThreadById).toHaveBeenCalledWith(threadId);
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
    expect(CommentReplyRepository.default.prototype.getReplyById).toHaveBeenCalledWith(replyId);
  });

  it("should not throw any error when delete reply with valid payload", async () => {
    // Arrange
    const username = 'testuser';
    const threadId = '123';
    const replyId = '456';
    const commentId = '21';

    // Act
    await useCase.execute({ username, threadId, replyId, commentId });

    // Assert
    expect(UserRepository.default.prototype.getUserByUsername).toHaveBeenCalledWith(username);
    expect(ThreadRepository.default.prototype.getThreadById).toHaveBeenCalledWith(threadId);
    expect(ThreadCommentsRepository.default.prototype.getCommentById).toHaveBeenCalledWith(commentId);
    expect(CommentReplyRepository.default.prototype.getReplyById).toHaveBeenCalledWith(replyId);

    expect(CommentReplyRepository.default.prototype.deleteReplyById).toHaveBeenCalledWith(replyId);
  });

  it("should throw error if user 'testuser' try to delete 'Ririka' reply ", async () => {
    // Arrange
    const username = 'testuser';
    const threadId = '123';
    const commentId = '21';
    const replyId = '456';
    CommentReplyRepository.default.prototype.getReplyById = jest.fn().mockResolvedValue({username: 'Ririka'});

    // Act & Assert
    await expect(useCase.execute({ username, threadId, replyId, commentId })).rejects.toThrow();
  });

  it('should throw error when execute with non-existed user', async () => {
    // Arrange
    const username = 'testuser';
    const threadId = '123';
    const commentId = '21';
    const replyId = '456';

    UserRepository.default.prototype.getUserByUsername = jest.fn().mockImplementation(() => {
      throw new Error("User not found");
    });

    // Act & Assert
    await expect(useCase.execute({ username, threadId, replyId, commentId })).rejects.toThrow("User not found");
  });

  it('should throw error when execute with non-existed thread', async () => {
    // Arrange
    const username = 'testuser';
    const threadId = '123';
    const commentId = '21';
    const replyId = '456';

    ThreadRepository.default.prototype.getThreadById = jest.fn().mockImplementation(() => {
      throw new Error("Thread not found");
    });

    // Act & Assert
    await expect(useCase.execute({ username, threadId, replyId, commentId })).rejects.toThrow("Thread not found");
  });

  it('should throw error when execute with non-existed comment', async () => {
    // Arrange
    const username = 'testuser';
    const threadId = '123';
    const commentId = '21';
    const replyId = '456';

    ThreadCommentsRepository.default.prototype.getCommentById = jest.fn().mockImplementation(() => {
      throw new Error("Comment not found");
    });

    // Act & Assert
    await expect(useCase.execute({ username, threadId, replyId, commentId })).rejects.toThrow("Comment not found");
  });

  it('should throw error when execute with non-existed reply', async () => {
    // Arrange
    const username = 'testuser';
    const threadId = '123';
    const commentId = '21';
    const replyId = '456';

    CommentReplyRepository.default.prototype.getReplyById = jest.fn().mockImplementation(() => {
      throw new Error("Reply not found");
    });

    // Act & Assert
    await expect(useCase.execute({ username, threadId, replyId, commentId })).rejects.toThrow("Reply not found");
  });
});
