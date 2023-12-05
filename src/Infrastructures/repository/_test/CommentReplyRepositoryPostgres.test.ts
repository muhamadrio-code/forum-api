import { AddedReply, CommentReply, CommentReplyEntity } from "../../../Domains/replies/entities";
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
    await threadCommentRepository.addComment({ id: '2', thread_id: '1', content: 'Test Comment', username: 'user12'});
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

  it('should successfully soft-delete reply', async () => {
    // Arrange
    const replyRepository = new CommentReplyRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const reply: CommentReply = { id: '2', thread_id: '1', content: 'Test Reply', username: 'user21', comment_id: '1' };
    await expect(replyRepository.addReply(reply)).resolves.not.toThrow();

    // Act & Assert
    await expect(replyRepository.deleteReplyById(reply.id)).resolves.not.toThrow();

    expect(poolSpy).toHaveBeenCalled();
    await expect(PostgresTestHelper.getCommentReplyById(pool, reply.id)).resolves.toHaveProperty('is_delete', true);
  });

  it('should throw "balasan tidak ditemukan" when try to delete non-existed reply', async () => {
    // Arrange
    const replyRepository = new CommentReplyRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const reply: CommentReply = { id: '2', thread_id: '1', content: 'Test Reply', username: 'user21', comment_id: '1' };
    await expect(replyRepository.addReply(reply)).resolves.not.toThrow();

    // Act & Assert
    await expect(replyRepository.deleteReplyById('99128')).rejects.toThrow('balasan tidak ditemukan');
    expect(poolSpy).toHaveBeenCalled();
    await expect(PostgresTestHelper.getCommentReplyById(pool, reply.id)).resolves.toHaveProperty('is_delete', false);
  });

  it('should successfully getRepliesByCommentIds and return the resultObj object', async () => {
     // Arrange
     const replyRepository = new CommentReplyRepositoryPostgres(pool);
     const poolSpy = jest.spyOn(pool, 'query');
     const reply1: CommentReply = { id: '1', thread_id: '1', content: 'Test Reply1', username: 'user21', comment_id: '1' };
     const reply2: CommentReply = { id: '2', thread_id: '1', content: 'Test Reply2', username: 'user22', comment_id: '2' };
     await replyRepository.addReply(reply1);
     await replyRepository.addReply(reply2);

     const resultObj: { [comment_id:string] : CommentReplyEntity[] } = {
        '1': [
          {
            id: '1',
            thread_id: '1',
            content: 'Test Reply1',
            username: 'user21',
            comment_id: '1',
            date: expect.any(String),
            is_delete: false
          }
        ],
        '2': [
          {
            id: '2',
            thread_id: '1',
            content: 'Test Reply2',
            username: 'user22',
            comment_id: '2',
            date: expect.any(String),
            is_delete: false
          }
        ]
     };

    // Act
    const result = await replyRepository.getRepliesByCommentIds([reply1.comment_id, reply2.comment_id]);

    // Assert
    expect(result).toStrictEqual(resultObj);
    expect(poolSpy).toHaveBeenCalled();
  });

  it('should return empty object when call getRepliesByCommentIds on comment with no reply', async () => {
     // Arrange
     const replyRepository = new CommentReplyRepositoryPostgres(pool);
     const poolSpy = jest.spyOn(pool, 'query');

    // Act & Assert
    await expect(replyRepository.getRepliesByCommentIds(['1'])).resolves.toStrictEqual({});
    expect(poolSpy).toHaveBeenCalled();
  });

  it('should successfully getReplyById and return CommentReplyEntity object', async () => {
    // Arrange
    const replyRepository = new CommentReplyRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const reply: CommentReply = { id: '1', thread_id: '1', content: 'Test Reply1', username: 'user21', comment_id: '1' };
    await replyRepository.addReply(reply);

    // Act
    const result = await replyRepository.getReplyById('1');

    // Assert
    expect(result).toStrictEqual({
      id: '1',
      thread_id: '1',
      content: 'Test Reply1',
      username: 'user21',
      comment_id: '1',
      date: expect.any(Date),
      is_delete: expect.any(Boolean)
    });
    expect(poolSpy).toHaveBeenCalled();
  });

  it('should throw "balasan tidak ditemukan" when getReplyById on non-existed reply', async () => {
    // Arrange
    const replyRepository = new CommentReplyRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');

    // Act & Assert
    await expect(replyRepository.getReplyById('1')).rejects.toThrow('balasan tidak ditemukan');
    expect(poolSpy).toHaveBeenCalled();
  });
});
