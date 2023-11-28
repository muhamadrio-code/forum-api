import NotFoundError from "../../../Common/Errors/NotFoundError";
import { Comment, CommentEntity } from "../../../Domains/entities/Comment";
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

  it('should successfully get comment reply', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const comment: Comment = { id: '1', threadId: '1', content: 'Test Comment', username: 'user12'};
    const commentReply: Comment = { id: '2', threadId: '1', content: 'Test Reply', username: 'user21', replyTo: '1' };

    await expect(threadCommentRepository.addComment(comment)).resolves.not.toThrow();
    await expect(threadCommentRepository.addCommentReply(commentReply)).resolves.not.toThrow();

    // Act & Assert
    await expect(threadCommentRepository.getCommentReplyById('2')).resolves.toStrictEqual({
      content: "Test Reply",
      date: expect.any(Date),
      id: "2",
      is_delete: false,
      reply_to: "1",
      thread_id: "1",
      username: "user21"
    });
    expect(poolSpy).toHaveBeenCalled();
  });

  it('should throw error when get comment reply on non-existed reply', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');

    // Act & Assert
    await expect(threadCommentRepository.getCommentReplyById('invalid')).rejects.toThrow('balasan tidak ditemukan');
    expect(poolSpy).toHaveBeenCalled();
  });

  it('should throw NotFoundError when call getCommentById on non-existed comment', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');

    // Act & Assert
    await expect(threadCommentRepository.getCommentById('invalid')).rejects.toThrow(NotFoundError);
    expect(poolSpy).toHaveBeenCalled();
  });

  it('should successfully add comment to the database and return the added comment', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const comment = { id: '1', threadId: '1', content: 'Test Comment', username: 'user12' };
    const commentEntity: CommentEntity = {
      id: '1',
      thread_id: '1',
      username: 'user12',
      content: 'Test Comment',
      date: expect.any(Date),
      is_delete: false,
      reply_to: null
    };

    // Act & Assert
    await expect(threadCommentRepository.addComment(comment))
      .resolves
      .toStrictEqual({ id: '1', content: 'Test Comment', owner: 'user12' });
    expect(poolSpy).toHaveBeenCalled();

    await expect(threadCommentRepository.getCommentById('1')).resolves.toStrictEqual(commentEntity);
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
