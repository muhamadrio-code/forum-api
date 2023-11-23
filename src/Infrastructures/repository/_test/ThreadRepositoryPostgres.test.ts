import { pool } from "../../database/postgres/Pool";
import ThreadRepositoryPostgres from "../ThreadRepositoryPostgres";
import { PostgresTestHelper } from "./helper/PostgresTestHelper";

describe("ThreadRepositoryPostgres", () => {

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: 'threads'
    });
  });

  it('should return AddedThread object after calling addThread', async () => {
    // Arrange
    const threadRepository = new ThreadRepositoryPostgres(pool);
    const querySpy = jest.spyOn(pool, 'query');
    const thread = {
      id: '1',
      title: 'Test Thread',
      body: 'This is a test thread',
      username: 'testuser'
    };

    // Act
    const result = await threadRepository.addThread(thread);

    // Assert
    expect(querySpy).toHaveBeenCalled();
    expect(result).toStrictEqual({
      id: '1',
      title: 'Test Thread',
      owner: 'testuser'
    });
  });

  it('should successfully add new thread to the database', async () => {
    // Arrange
    const threadRepository = new ThreadRepositoryPostgres(pool);
    const querySpy = jest.spyOn(pool, 'query');
    const thread = {
      id: '1',
      title: 'Test Thread',
      body: 'This is a test thread',
      username: 'testuser'
    };

    // Act
    await threadRepository.addThread(thread);
    const result = await threadRepository.getThreadById(thread.id);

    // Assert
    expect(querySpy).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should return ThreadEntity object', async () => {
    // Arrange
    const threadRepository = new ThreadRepositoryPostgres(pool);
    const querySpy = jest.spyOn(pool, 'query');
    const thread = {
      id: '1',
      title: 'Test Thread',
      body: 'This is a test thread',
      username: 'testuser'
    };

    // Act
    await threadRepository.addThread(thread);
    const result = await threadRepository.getThreadById(thread.id);

    // Assert
    expect(querySpy).toHaveBeenCalled();
    expect(result).toStrictEqual({
      id: '1',
      title: 'Test Thread',
      body: 'This is a test thread',
      username: 'testuser',
      date: expect.any(Date)
    });
  });

  it('should not throw error when call verifyThreadAvaibility if thread is exist', async () => {
    // Arrange
    const threadRepository = new ThreadRepositoryPostgres(pool);
    const querySpy = jest.spyOn(pool, 'query');
    const thread = {
      id: '1',
      title: 'Test Thread',
      body: 'This is a test thread',
      username: 'testuser'
    };

    // Act
    await threadRepository.addThread(thread);

    // Assert
    await expect(threadRepository.verifyThreadAvaibility(thread.id)).resolves.not.toThrow();
    expect(querySpy).toHaveBeenCalled();
  });

  it('should throw error when call verifyThreadAvaibility if thread is not exist', async () => {
    // Arrange
    const threadRepository = new ThreadRepositoryPostgres(pool);
    const querySpy = jest.spyOn(pool, 'query');

    // Act & Assert
    await expect(threadRepository.verifyThreadAvaibility('999')).rejects.toThrow();
    expect(querySpy).toHaveBeenCalled();
  });
});