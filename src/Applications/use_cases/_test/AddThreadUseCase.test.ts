import { AddedThread } from "../../../Domains/entities/Thread";
import ThreadRepository from "../../../Domains/threads/ThreadRepository";
import ZodThreadValidator from "../../../Infrastructures/security/ZodThreadValidator";
import AddThreadUseCase from "../AddThreadUseCase";

describe('AddThreadUseCase', () => {
  let threadRepositoryMock: jest.Mocked<ThreadRepository>;
  let validatorMock: jest.Mocked<ZodThreadValidator>;
  let addThreadUseCase: AddThreadUseCase;

  beforeEach(async () => {
    // Arrange
    threadRepositoryMock = {
      addThread: jest.fn().mockResolvedValue({
        id: 'id123',
        title: "this is title",
        body: "this is body",
        username: "username1"
      }),
      getThreadById: jest.fn(),
      verifyThreadAvaibility: jest.fn(),
      getThreadDetails: jest.fn()
    };

    validatorMock = {
      validatePayload: jest.fn().mockImplementation((arg) => arg),
    };

    addThreadUseCase = new AddThreadUseCase(threadRepositoryMock, validatorMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate the payload schema before proceeding', async () => {
    // Arange
    const payload = { title: "this is title", body: "this is body" };

    // Act
    await addThreadUseCase.execute({ ...payload, username: 'username1' });

    // Assert
    expect(validatorMock.validatePayload)
      .toHaveBeenCalledWith({ title: "this is title", body: "this is body" });
  });

  it('should add the valid payload to the database', async () => {
     // Arange
     const payload = { title: "this is title", body: "this is body" };

    // Act
    const result: AddedThread = await addThreadUseCase.execute({ ...payload, username: 'username1' });

     // Assert
    expect(threadRepositoryMock.addThread).toHaveBeenCalledTimes(1);
    expect(threadRepositoryMock.addThread)
    .toHaveBeenCalledWith({ id: expect.any(String), title: "this is title", body: "this is body", username: 'username1' });
    expect(result).toStrictEqual({
      id: "id123",
      title: "this is title",
      body: "this is body",
      username: "username1"
    });
  });
});