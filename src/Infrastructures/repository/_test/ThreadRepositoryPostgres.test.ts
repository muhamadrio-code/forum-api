import { Thread, ThreadEntity } from "../../../Domains/threads/entities";
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

  it('should persist the thread and return AddedThread object when calling addThread', async () => {
    // Arrange
    const threadRepository = new ThreadRepositoryPostgres(pool);
    const querySpy = jest.spyOn(pool, 'query');
    const thread = {
      id: '1',
      title: 'Test Thread',
      body: 'This is a test thread',
      username: 'testuser'
    };
    const threadEntity: ThreadEntity = {
      id: '1',
      title: 'Test Thread',
      body: 'This is a test thread',
      username: 'testuser',
      date: expect.any(Date)
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

    await expect(threadRepository.getThreadById(thread.id)).resolves.toStrictEqual(threadEntity);
  });

  it('should return ThreadEntity object when call getThreadById', async () => {
    // Arrange
    const threadRepository = new ThreadRepositoryPostgres(pool);
    const querySpy = jest.spyOn(pool, 'query');
    const thread: Thread = {
      id: '1',
      title: 'Test Thread',
      body: 'This is a test thread',
      username: 'testuser'
    };
    const threadEntity: ThreadEntity = {
      id: '1',
      title: 'Test Thread',
      body: 'This is a test thread',
      username: 'testuser',
      date: expect.any(Date)
    };


    // Act
    await threadRepository.addThread(thread);
    const result = await threadRepository.getThreadById(thread.id);

    // Assert
    expect(querySpy).toHaveBeenCalled();
    expect(result).toStrictEqual(threadEntity);
  });

  it("should throw 'thread tidak ditemukan' when call getThreadById if thread is not exist", async () => {
    // Arrange
    const threadRepository = new ThreadRepositoryPostgres(pool);
    const querySpy = jest.spyOn(pool, 'query');

    // Act & Assert
    await expect(threadRepository.getThreadById('id-123')).rejects.toThrow('thread tidak ditemukan');
    expect(querySpy).toHaveBeenCalled();
  });
});