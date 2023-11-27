import NotFoundError from "../../../Common/Errors/NotFoundError";
import { pool } from "../../database/postgres/Pool";
import ThreadCommentRepositoryPostgres from "../ThreadCommentRepositoryPostgres";
import ThreadRepositoryPostgres from "../ThreadRepositoryPostgres";
import { PostgresTestHelper } from "./helper/PostgresTestHelper";


describe('ThreadCommentRepositoryPostgres', () => {

  beforeEach(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: ['threads', 'thread_comments']
    });
    const threadRepository = new ThreadRepositoryPostgres(pool);
    await threadRepository.addThread({ id: '1', body: "body", title: 'tile', username: 'username' });
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await pool.end();
  });

  it('should successfully add comment to the database and return the added comment', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const comment = { id: '1', threadId: '1', content: 'Test Comment', username: 'Test User' };

    // Act & Assert
    await expect(threadCommentRepository.addComment(comment))
      .resolves
      .toStrictEqual({ id: '1', content: 'Test Comment', owner: 'Test User' });
    expect(poolSpy).toHaveBeenCalled();

    await expect(PostgresTestHelper.getCommentById(pool, '1')).resolves.toBeDefined();
  });

  it('should soft-delete comment and return the DeletedComment object', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const comment = { id: '1', threadId: '1', content: 'Test Comment', username: 'Test User' };
    await threadCommentRepository.addComment(comment);

    // Act & Assert
    await expect(threadCommentRepository.deleteComment('1')).resolves.toStrictEqual({
      content: "Test Comment"
    });

    expect(poolSpy).toHaveBeenCalled();
    await expect(PostgresTestHelper.getCommentById(pool, '1')).resolves.toHaveProperty('is_delete', true);
  });

  it('should throw NotFoundError when try to delete non-existed comment', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const comment = { id: '1', threadId: '1', content: 'Test Comment', username: 'Test User' };
    await threadCommentRepository.addComment(comment);

    // Act & Assert
    await expect(threadCommentRepository.deleteComment('99128')).rejects.toThrow(NotFoundError);
    expect(poolSpy).toHaveBeenCalled();
  });

  it('should successfully add reply', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'connect');
    const comment = { id: 'c-1', threadId: '1', content: 'Test Comment', username: 'Test User' };
    await threadCommentRepository.addComment(comment);

    // Action
    const reply = await threadCommentRepository.addCommentReply({
      id: 'rep-1', threadId: '1', content: 'Test balasan', username: 'Test User', replyTo: 'c-1'
    });
    const result = await PostgresTestHelper.getCommentById(pool, 'rep-1');

    // Act & Assert
    expect(reply).toStrictEqual({
        content: "Test balasan",
        id: "rep-1",
        owner: "Test User",
      });

    expect(result).toBeDefined();
    expect(poolSpy).toHaveBeenCalled();
  });

  it('should throw NotFoundError when add reply to non-existed comment', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);

    // Act & Assert
    await expect(threadCommentRepository.addCommentReply({
      id: 'rep-1', threadId: '213', content: 'Test balasan', username: 'Test User', replyTo: 'c-1'
    })).rejects.toThrow(NotFoundError);
  });
});
