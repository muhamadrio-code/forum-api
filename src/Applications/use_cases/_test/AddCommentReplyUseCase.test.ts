import { AddReplyUseCasePayload, AddedReply } from "../../../Domains/replies/entities";
import AddCommentReplyUseCase from "../AddCommentReplyUseCase";
const UserRepository =
  jest.createMockFromModule<typeof import("../../../Domains/users/UserRepository")>("../../../Domains/users/UserRepository");
const ThreadRepository =
  jest.createMockFromModule<typeof import("../../../Domains/threads/ThreadRepository")>("../../../Domains/threads/ThreadRepository");
const ThreadCommentsRepository =
  jest.createMockFromModule<typeof import("../../../Domains/comments/ThreadCommentsRepository")>("../../../Domains/comments/ThreadCommentsRepository");
const Validator =
  jest.createMockFromModule<typeof import("../../security/Validator")>("../../security/Validator");
const CommentReplyRepository =
  jest.createMockFromModule<typeof import("../../../Domains/replies/CommentReplyRepository")>("../../../Domains/replies/CommentReplyRepository");

describe('AddCommentReplyuseCase', () => {
  let useCase: AddCommentReplyUseCase;

  beforeEach(() => {
    jest.resetAllMocks();

    UserRepository.default.prototype.getUserByUsername = jest.fn();
    ThreadRepository.default.prototype.getThreadById = jest.fn();
    Validator.default.prototype.validatePayload = jest.fn();
    CommentReplyRepository.default.prototype.addReply = jest.fn();
    ThreadCommentsRepository.default.prototype.getCommentById = jest.fn();

    useCase = new AddCommentReplyUseCase(
      ThreadCommentsRepository.default.prototype,
      UserRepository.default.prototype,
      ThreadRepository.default.prototype,
      Validator.default.prototype,
      CommentReplyRepository.default.prototype
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it("should validate the content is valid before proceeding", async () => {
    // Arrange
    const content = 'test reply';
    const username = 'testuser';
    const thread_id = '123';
    const comment_id = '456';
    // Act
    await useCase.execute({ content, username, thread_id, comment_id });

    // Assert
    expect(Validator.default.prototype.validatePayload).toHaveBeenCalledWith({content});
  });

  it("should validate the username is valid before proceeding", async () => {
    // Arrange
    const content = 'test reply';
    const username = 'testuser';
    const thread_id = '123';
    const comment_id = '456';

    // Act
    await useCase.execute({ content, username, thread_id, comment_id });

    // Assert
    expect(UserRepository.default.prototype.getUserByUsername).toHaveBeenCalledWith(username);
  });

  it("should validate that thread is exist before proceeding", async () => {
    // Arrange
    const content = 'test reply';
    const username = 'testuser';
    const thread_id = '123';
    const comment_id = '456';

    // Act
    await useCase.execute({ content, username, thread_id, comment_id });

    // Assert
    expect(ThreadRepository.default.prototype.getThreadById).toHaveBeenCalledWith(thread_id);
  });

  it("should validate that comment is exist before proceeding", async () => {
    // Arrange
    const content = 'test reply';
    const username = 'testuser';
    const thread_id = '123';
    const comment_id = '456';

    // Act
    await useCase.execute({ content, username, thread_id, comment_id });

    // Assert
    expect(ThreadCommentsRepository.default.prototype.getCommentById).toHaveBeenCalledWith(comment_id);
  });

  it('should not throw any error when add new reply to the comment when given a valid input', async () => {
    // Arrange
    const content = 'test reply';
    const username = 'testuser';
    const thread_id = '1';
    const comment_id = '1';

    // Act
    await useCase.execute({ content, username, thread_id, comment_id });

    // Assert
    expect(Validator.default.prototype.validatePayload).toHaveBeenCalledWith({content});
    expect(UserRepository.default.prototype.getUserByUsername).toHaveBeenCalledWith(username);
    expect(ThreadRepository.default.prototype.getThreadById).toHaveBeenCalledWith(thread_id);
    expect(ThreadCommentsRepository.default.prototype.getCommentById).toHaveBeenCalledWith(comment_id);

    expect(CommentReplyRepository.default.prototype.addReply).toHaveBeenCalledWith({
      id: expect.any(String),
      thread_id,
      content,
      username,
      comment_id,
    });
  });

  it("should successfully return AddedReply object", async () => {
    // Arange
    const content = 'test reply';
    const username = 'testuser';
    const thread_id = '123';
    const comment_id = '456';
    const addedReply : AddedReply = {
      content, owner: username, id:'comment123'
    };

    CommentReplyRepository.default.prototype.addReply =
      jest.fn().mockResolvedValue({
        content: 'test reply', owner: 'testuser', id:'comment123'
      });

    // Act
    const result = await useCase.execute({ content, username, thread_id, comment_id });

    // Assert
    expect(Validator.default.prototype.validatePayload).toHaveBeenCalledWith({content});
    expect(UserRepository.default.prototype.getUserByUsername).toHaveBeenCalledWith(username);
    expect(ThreadRepository.default.prototype.getThreadById).toHaveBeenCalledWith(thread_id);
    expect(ThreadCommentsRepository.default.prototype.getCommentById).toHaveBeenCalledWith(comment_id);
    expect(CommentReplyRepository.default.prototype.addReply).toHaveBeenCalledWith({
      id: expect.any(String),
      thread_id,
      content,
      username,
      comment_id
    });

    expect(result).toStrictEqual(addedReply);
  });

  it('should throw error when execute with invalid content', async () => {
    // Arrange
    const useCasePayload: AddReplyUseCasePayload = {
      content: "",
      thread_id: "thread-1",
      username: "user-1",
      comment_id: "1"
    };
    Validator.default.prototype.validatePayload = jest.fn().mockImplementation(() => {
      throw new Error("Validation Error");
    });

    // Act & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow();
  });

  it('should throw error when execute with non-existed user', async () => {
    // Arrange
    const useCasePayload: AddReplyUseCasePayload = {
      content: "content 1",
      thread_id: "thread-1",
      username: "",
      comment_id: "1"
    };
    UserRepository.default.prototype.getUserByUsername = jest.fn().mockImplementation(() => {
      throw new Error("User not found");
    });

    // Act & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow("User not found");
  });

  it('should throw error when execute with non-existed thread', async () => {
    // Arrange
    const useCasePayload: AddReplyUseCasePayload = {
      content: "content 1",
      thread_id: "",
      username: "user-1",
      comment_id: "1"
    };
    ThreadRepository.default.prototype.getThreadById = jest.fn().mockImplementation(() => {
      throw new Error("Thread not found");
    });

    // Act & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow("Thread not found");
  });

  it('should throw error when execute with non-existed comment', async () => {
    // Arrange
    const useCasePayload: AddReplyUseCasePayload = {
      content: "content 1",
      thread_id: "th-1",
      username: "user-1",
      comment_id: ""
    };
    ThreadCommentsRepository.default.prototype.getCommentById = jest.fn().mockImplementation(() => {
      throw new Error("Comment not found");
    });

    // Act & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow("Comment not found");
  });
});
