import AddThreadCommentUseCase from "../AddThreadCommentUseCase";
const UserRepository =
  jest.createMockFromModule<typeof import("../../../Domains/users/UserRepository")>("../../../Domains/users/UserRepository");
const ThreadRepository =
  jest.createMockFromModule<typeof import("../../../Domains/threads/ThreadRepository")>("../../../Domains/threads/ThreadRepository");
const ThreadCommentsRepository =
  jest.createMockFromModule<typeof import("../../../Domains/comments/ThreadCommentsRepository")>("../../../Domains/comments/ThreadCommentsRepository");
const Validator =
  jest.createMockFromModule<typeof import("../../security/Validator")>("../../security/Validator");

describe('AddThreadCommentUseCase', () => {
  const useCasePayload = { content: "content-1", thread_id: "thread-1", username: "user-1" };
  let addThreadCommentUseCase: AddThreadCommentUseCase;

  beforeEach(() => {
    jest.resetAllMocks();

    UserRepository.default.prototype.getUserByUsername = jest.fn();
    ThreadRepository.default.prototype.getThreadById = jest.fn();
    Validator.default.prototype.validatePayload = jest.fn();
    ThreadCommentsRepository.default.prototype.addComment = jest.fn();

    addThreadCommentUseCase = new AddThreadCommentUseCase(
      ThreadCommentsRepository.default.prototype,
      UserRepository.default.prototype,
      ThreadRepository.default.prototype,
      Validator.default.prototype
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it("it should validate the content before proceeding", async () => {
    await addThreadCommentUseCase.execute(useCasePayload);
    expect(Validator.default.prototype.validatePayload).toHaveBeenCalledWith({
      content: useCasePayload.content
    });
  });

  it("it should validate that user is exist before proceeding", async () => {
    await addThreadCommentUseCase.execute(useCasePayload);
    expect(UserRepository.default.prototype.getUserByUsername).toHaveBeenCalledWith(
      useCasePayload.username
    );
  });

  it("it should validate that thread is exist before proceeding", async () => {
    await addThreadCommentUseCase.execute(useCasePayload);
    expect(ThreadRepository.default.prototype.getThreadById).toHaveBeenCalledWith(
      useCasePayload.thread_id
    );
  });

  it("it should successfully add comment and return AddedComment object", async () => {
    // Arange
    ThreadCommentsRepository.default.prototype.addComment =
      jest.fn().mockResolvedValue({
        id: "comment123",
        content: "content-1",
        thread_id: "thread-1",
        username: "user-1"
      });

    // Act
    const result = await addThreadCommentUseCase.execute(useCasePayload);

    // Assert
    expect(Validator.default.prototype.validatePayload).toHaveBeenCalled();
    expect(UserRepository.default.prototype.getUserByUsername).toHaveBeenCalled();
    expect(ThreadRepository.default.prototype.getThreadById).toHaveBeenCalled();
    expect(ThreadCommentsRepository.default.prototype.addComment).toHaveBeenCalledWith({
      id: expect.any(String),
      thread_id: useCasePayload.thread_id,
      content: useCasePayload.content,
      username: useCasePayload.username
    });
    expect(result).toStrictEqual({
      id: "comment123",
      content: "content-1",
      thread_id: "thread-1",
      username: "user-1"
    });
  });

  it('should throw error when execute with invalid content', async () => {
    // Arrange
    const useCasePayload = { content: "", thread_id: "thread-1", username: "user-1" };
    Validator.default.prototype.validatePayload = jest.fn().mockImplementation(() => {
      throw new Error("Validation Error");
    });

    // Act & Assert
    await expect(addThreadCommentUseCase.execute(useCasePayload)).rejects.toThrow("Validation Error");
  });

  it('should throw error when execute with non existing user', async () => {
    // Arrange
    const useCasePayload = { content: "valid content", thread_id: "valid-id", username: "invalid-user-1" };
    UserRepository.default.prototype.getUserByUsername = jest.fn().mockImplementation(() => {
      throw new Error("User not found");
    });

    // Act & Assert
    await expect(addThreadCommentUseCase.execute(useCasePayload)).rejects.toThrow("User not found");
  });

  it('should throw error when execute with non existing thread', async () => {
    // Arrange
    const useCasePayload = { content: "valid content", thread_id: "invalid-id", username: "user-1" };
    ThreadRepository.default.prototype.getThreadById = jest.fn().mockImplementation(() => {
      throw new Error("Thread not found");
    });

    // Act & Assert
    await expect(addThreadCommentUseCase.execute(useCasePayload)).rejects.toThrow("Thread not found");
  });
});
