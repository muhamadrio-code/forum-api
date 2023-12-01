import { pool } from "../../database/postgres/Pool";
import ThreadRepositoryPostgres from "../ThreadRepositoryPostgres";
import { PostgresTestHelper } from "./helper/PostgresTestHelper";

describe("ThreadRepositoryPostgres", () => {

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: ['threads', 'thread_comments']
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

  it('should throw error when call getThreadDetails if thread is not exist', async () => {
    // Arrange
    const threadRepository = new ThreadRepositoryPostgres(pool);
    const querySpy = jest.spyOn(pool, 'query');

    // Act & Assert
    await expect(threadRepository.getThreadDetails('999')).rejects.toThrow('thread tidak ditemukan');
    expect(querySpy).toHaveBeenCalled();
  });

  it('should return ThreadDetails with comments and replies when getThreadDetails is called', async () => {
    // Arrange
    const threadRepository = new ThreadRepositoryPostgres(pool);
    await threadRepository.addThread({ id: '1', body: 'body-1', title: 'title-1', username: 'user-1' });
    await PostgresTestHelper.addComment(pool, { id: '1', content: 'content 1', threadId: '1', username: 'user-2' });
    await PostgresTestHelper.addCommentReply(pool, { id: '2', content: 'content 2', threadId: '1', username: 'user-3', replyTo: '1', isDelete: true });
    const querySpy = jest.spyOn(pool, 'query');

    // Act & Assert
    await expect(threadRepository.getThreadDetails('1')).resolves.toStrictEqual({
      id: '1',
      title: 'title-1',
      body: 'body-1',
      date: expect.any(Date),
      username: 'user-1',
      comments: [{
        id: '1',
        content: 'content 1',
        date: expect.any(String),
        username: 'user-2',
        replies: [{
          id: '2',
          content: '**balasan telah dihapus**',
          date: expect.any(String),
          username: 'user-3'
        }]
      }]
    });
    expect(querySpy).toHaveBeenCalled();
  });
});