import { AddedComment } from "../../../Domains/entities/Comment";
import AddCommentReplyuseCase from "../AddCommentReplyUseCase";
const UserRepository =
  jest.createMockFromModule<typeof import("../../../Domains/users/UserRepository")>("../../../Domains/users/UserRepository");
const ThreadRepository =
  jest.createMockFromModule<typeof import("../../../Domains/threads/ThreadRepository")>("../../../Domains/threads/ThreadRepository");
const ThreadCommentsRepository =
  jest.createMockFromModule<typeof import("../../../Domains/comments/ThreadCommentsRepository")>("../../../Domains/comments/ThreadCommentsRepository");
const Validator =
  jest.createMockFromModule<typeof import("../../security/Validator")>("../../security/Validator");

describe('AddThreadCommentReplyUseCase', () => {
  let useCase: AddCommentReplyuseCase;

  beforeEach(() => {
    jest.resetAllMocks();

    UserRepository.default.prototype.getUserByUsername = jest.fn();
    ThreadRepository.default.prototype.getThreadById = jest.fn();
    Validator.default.prototype.validatePayload = jest.fn();
    ThreadCommentsRepository.default.prototype.addCommentReply = jest.fn();

    useCase = new AddCommentReplyuseCase(
      ThreadCommentsRepository.default.prototype,
      UserRepository.default.prototype,
      ThreadRepository.default.prototype,
      Validator.default.prototype
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it("it should validate the content is valid before proceeding", async () => {
    // Arrange
    const content = 'Test comment';
    const username = 'testuser';
    const thread_id = '123';
    const reply_to = '456';
    // Act
    await useCase.execute({ content, username, thread_id, reply_to });

    // Assert
    expect(Validator.default.prototype.validatePayload).toHaveBeenCalledWith({content});
  });

  it("it should validate the username is valid before proceeding", async () => {
    // Arrange
    const content = 'Test comment';
    const username = 'testuser';
    const thread_id = '123';
    const reply_to = '456';

    // Act
    await useCase.execute({ content, username, thread_id, reply_to });

    // Assert
    expect(UserRepository.default.prototype.getUserByUsername).toHaveBeenCalledWith(username);
  });

  it("it should validate that thread is exist before proceeding", async () => {
    // Arrange
    const content = 'Test comment';
    const username = 'testuser';
    const thread_id = '123';
    const reply_to = '456';

    // Act
    await useCase.execute({ content, username, thread_id, reply_to });

    // Assert
    expect(ThreadRepository.default.prototype.getThreadById).toHaveBeenCalledWith(thread_id);
  });

  it('should add a new comment reply to the thread comments repository when given valid input', async () => {
    // Arrange
    const content = 'Test comment';
    const username = 'testuser';
    const thread_id = '123';
    const reply_to = '456';

    // Act
    await useCase.execute({ content, username, thread_id, reply_to });

    // Assert
    expect(ThreadCommentsRepository.default.prototype.addCommentReply).toHaveBeenCalledWith({
      id: expect.any(String),
      thread_id,
      content,
      username,
      reply_to,
    });
  });

  it("it should successfully return AddedComment object", async () => {
    // Arange
    const content = 'Test comment';
    const username = 'testuser';
    const thread_id = '123';
    const reply_to = '456';
    const addedComment : AddedComment = {
      content, owner: username, id:'comment123'
    };

    ThreadCommentsRepository.default.prototype.addCommentReply =
      jest.fn().mockResolvedValue(addedComment);

    // Act
    const result = await useCase.execute({ content, username, thread_id, reply_to });

    // Assert
    expect(ThreadCommentsRepository.default.prototype.addCommentReply).toHaveBeenCalledWith({
      id: expect.any(String),
      thread_id,
      content,
      username,
      reply_to
    });
    expect(result).toStrictEqual({
      content: 'Test comment', owner: 'testuser', id:'comment123'
    });
  });

  it('should throw error when execute with invalid content', async () => {
    // Arrange
    const useCasePayload = { content: "", thread_id: "thread-1", username: "user-1" };
    Validator.default.prototype.validatePayload = jest.fn().mockImplementation(() => {
      throw new Error("Validation Error");
    });

    // Act & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow();
  });

  it('should throw error when execute with non existing user', async () => {
    // Arrange
    const useCasePayload = { content: "valid content", thread_id: "valid-id", username: "invalid-user-1" };
    UserRepository.default.prototype.getUserByUsername = jest.fn().mockImplementation(() => {
      throw new Error("User not found");
    });

    // Act & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow("User not found");
  });

  it('should throw error when execute with non existing thread', async () => {
    // Arrange
    const useCasePayload = { content: "valid content", thread_id: "invalid-id", username: "user-1" };
    ThreadRepository.default.prototype.getThreadById = jest.fn().mockImplementation(() => {
      throw new Error("Thread not found");
    });

    // Act & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow("Thread not found");
  });
});
