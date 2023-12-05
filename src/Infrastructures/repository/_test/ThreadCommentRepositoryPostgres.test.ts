import NotFoundError from "../../../Common/Errors/NotFoundError";
import { Comment, CommentEntity } from "../../../Domains/comments/entities";
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
    const comment: Comment = { id: '1', thread_id: '1', content: 'Test Comment', username: 'user12' };
    const commentEntity: CommentEntity = {
      id: '1',
      thread_id: '1',
      content: 'Test Comment',
      username: 'user12',
      date: expect.any(Date),
      is_delete: false
    };

    // Act & Assert
    await expect(threadCommentRepository.addComment(comment)).resolves
      .toStrictEqual({ id: '1', content: 'Test Comment', owner: 'user12' });

    expect(poolSpy).toHaveBeenCalled();

    await expect(threadCommentRepository.getCommentById('1')).resolves.toStrictEqual(commentEntity);
  });

  it('should return CommentEntity object when call getCommentById', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const comment: Comment = { id: '1', thread_id: '1', content: 'Test Comment', username: 'user12' };
    const commentEntity: CommentEntity = {
      id: '1',
      thread_id: '1',
      content: 'Test Comment',
      username: 'user12',
      date: expect.any(Date),
      is_delete: false
    };
    await expect(threadCommentRepository.addComment(comment)).resolves.not.toThrow();

    // Act & Assert
    await expect(threadCommentRepository.getCommentById(comment.id)).resolves.toStrictEqual(commentEntity);
    expect(poolSpy).toHaveBeenCalled();
  });

  it("should throw 'comment tidak ditemukan' when call getCommentById on non-existed comment", async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');

    // Act & Assert
    await expect(threadCommentRepository.getCommentById('invalid')).rejects.toThrow("comment tidak ditemukan");
    expect(poolSpy).toHaveBeenCalled();
  });

  it('should return list of CommentEntity object when call getCommentsByThreadId', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const threadId = '1';
    const comment1: Comment = { id: '1', thread_id: threadId, content: 'Test Comment1', username: 'user12' };
    const comment2: Comment = { id: '2', thread_id: threadId, content: 'Test Comment2', username: 'user1' };
    const commentEntities: CommentEntity[] = [{
      id: '1',
      thread_id: '1',
      content: 'Test Comment1',
      username: 'user12',
      date: expect.any(Date),
      is_delete: false
    },
    {
      id: '2',
      thread_id: '1',
      content: 'Test Comment2',
      username: 'user1',
      date: expect.any(Date),
      is_delete: false
    }];

    await expect(threadCommentRepository.addComment(comment1)).resolves.not.toThrow();
    await expect(threadCommentRepository.addComment(comment2)).resolves.not.toThrow();

    // Act & Assert
    await expect(threadCommentRepository.getCommentsByThreadId(threadId)).resolves.toStrictEqual(commentEntities);
    expect(poolSpy).toHaveBeenCalled();
  });

  it("should return empty array when call getCommentsByThreadId on thread with no comment", async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');

    // Act
    const result = await threadCommentRepository.getCommentsByThreadId('1');

    // Act & Assert
    expect(result).toStrictEqual(expect.any(Array));
    expect(result.length).toEqual(0);
    expect(poolSpy).toHaveBeenCalled();
  });


  it('should soft-delete comment and return the DeletedComment object', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const comment: Comment = { id: '1', thread_id: '1', content: 'Test Comment', username: 'Test User' };
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
    const comment: Comment = { id: '1', thread_id: '1', content: 'Test Comment', username: 'Test User' };
    await threadCommentRepository.addComment(comment);

    // Act & Assert
    await expect(threadCommentRepository.deleteComment('99128')).rejects.toThrow(NotFoundError);
    expect(poolSpy).toHaveBeenCalled();

    await expect(PostgresTestHelper.getCommentById(pool, '1')).resolves.toHaveProperty('is_delete', false);
  });

});
