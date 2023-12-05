import { AddedReply, CommentReply } from "../../../Domains/replies/entities";
import { pool } from "../../database/postgres/Pool";
import CommentReplyRepositoryPostgres from "../CommentReplyRepositoryPostgres";
import ThreadCommentRepositoryPostgres from "../ThreadCommentRepositoryPostgres";
import ThreadRepositoryPostgres from "../ThreadRepositoryPostgres";
import { PostgresTestHelper } from "./helper/PostgresTestHelper";


describe('CommentReplyRepositoryPostgres', () => {

  beforeAll(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: ['threads', 'thread_comments']
    });
    const threadRepository = new ThreadRepositoryPostgres(pool);
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    await threadRepository.addThread({ id: '1', body: "body", title: 'tile', username: 'username' });
    await threadCommentRepository.addComment({ id: '1', thread_id: '1', content: 'Test Comment', username: 'user12'});
  });

  beforeEach(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: 'replies'
    });
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await pool.end();
  });

  it('should successfully add comment reply and return AddedReply object', async () => {
    // Arrange
    const threadCommentRepository = new CommentReplyRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const reply: CommentReply = { id: '2', thread_id: '1', content: 'Test Reply', username: 'user21', comment_id: '1' };
    const addedReply: AddedReply = {
      id: '2',
      content: 'Test Reply',
      owner: 'user21'
    };

    // Act & Assert
    await expect(threadCommentRepository.addReply(reply)).resolves.toStrictEqual(addedReply);
    expect(poolSpy).toHaveBeenCalled();
  });

  it('should persist the comment reply', async () => {
    // Arrange
    const replyRepository = new CommentReplyRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const reply: CommentReply = { id: '2', thread_id: '1', content: 'Test Reply', username: 'user21', comment_id: '1' };
    await replyRepository.addReply(reply);

    // Act & Assert
    expect(poolSpy).toHaveBeenCalled();
    await expect(PostgresTestHelper.getCommentReplyById(pool, '2')).resolves.toStrictEqual({
      id: '2',
      thread_id: '1',
      content: 'Test Reply',
      username: 'user21',
      comment_id: '1',
      date: expect.any(Date),
      is_delete: expect.any(Boolean)
    });
  });

  it('should soft-delete reply and return the DeletedReply object', async () => {
    // Arrange
    const replyRepository = new CommentReplyRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const reply: CommentReply = { id: '2', thread_id: '1', content: 'Test Reply', username: 'user21', comment_id: '1' };
    await replyRepository.addReply(reply);

    // Act & Assert
    await expect(replyRepository.deleteReplyById(reply.id)).resolves.toStrictEqual({
      content: "Test Reply"
    });

    expect(poolSpy).toHaveBeenCalled();
    await expect(PostgresTestHelper.getCommentReplyById(pool, reply.id)).resolves.toHaveProperty('is_delete', true);
  });

  it('should throw "balasan tidak ditemukan" when try to delete non-existed reply', async () => {
    // Arrange
    const replyRepository = new CommentReplyRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const reply: CommentReply = { id: '2', thread_id: '1', content: 'Test Reply', username: 'user21', comment_id: '1' };
    await replyRepository.addReply(reply);

    // Act & Assert
    await expect(replyRepository.deleteReplyById('99128')).rejects.toThrow('balasan tidak ditemukan');
    expect(poolSpy).toHaveBeenCalled();
    await expect(PostgresTestHelper.getCommentReplyById(pool, reply.id)).resolves.toHaveProperty('is_delete', false);
  });

  it('should successfully getRepliesByCommentId and return list of CommentReplyEntity object', async () => {
     // Arrange
     const replyRepository = new CommentReplyRepositoryPostgres(pool);
     const poolSpy = jest.spyOn(pool, 'query');
     const reply1: CommentReply = { id: '1', thread_id: '1', content: 'Test Reply1', username: 'user21', comment_id: '1' };
     const reply2: CommentReply = { id: '2', thread_id: '1', content: 'Test Reply2', username: 'user22', comment_id: '1' };
     await replyRepository.addReply(reply1);
     await replyRepository.addReply(reply2);

    // Act
    const result = await replyRepository.getRepliesByCommentId('1');

    // Assert
    expect(result).toStrictEqual(expect.any(Array));
    expect(result.length).toEqual(2);
    expect(result).toStrictEqual([
      {
        id: '1',
        thread_id: '1',
        content: 'Test Reply1',
        username: 'user21',
        comment_id: '1',
        date: expect.any(Date),
        is_delete: expect.any(Boolean)
      },
      {
        id: '2',
        thread_id: '1',
        content: 'Test Reply2',
        username: 'user22',
        comment_id: '1',
        date: expect.any(Date),
        is_delete: expect.any(Boolean)
      }
    ]);
    expect(poolSpy).toHaveBeenCalled();
  });

  it('should throw "balasan tidak ditemukan" when call getRepliesByCommentId on comment with no reply', async () => {
     // Arrange
     const replyRepository = new CommentReplyRepositoryPostgres(pool);
     const poolSpy = jest.spyOn(pool, 'query');

    // Act & Assert
    await expect(replyRepository.getRepliesByCommentId('1')).rejects.toThrow('balasan tidak ditemukan');
    expect(poolSpy).toHaveBeenCalled();
  });
});
