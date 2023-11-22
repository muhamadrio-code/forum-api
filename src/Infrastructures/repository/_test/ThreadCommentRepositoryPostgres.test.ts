import { pool } from "../../database/postgres/Pool";
import ThreadCommentRepositoryPostgres from "../ThreadCommentRepositoryPostgres";
import ThreadRepositoryPostgres from "../ThreadRepositoryPostgres";
import { PostgresTestHelper } from "./helper/PostgresTestHelper";

describe('ThreadCommentRepositoryPostgres', () => {

  beforeEach(async () => {
    const threadRepository = new ThreadRepositoryPostgres(pool);
    await threadRepository.addThread({ id: '1', body: "body", title:'tile', username:'username' });
  });

  afterEach(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: 'thread_comments'
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should successfully add comment to the database and return the added comment', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool);
    const poolSpy = jest.spyOn(pool, 'query');
    const comment = { id: '1', thread_id: '1', content: 'Test Comment', username: 'Test User' };

    // Act & Assert
    await expect(threadCommentRepository.addComment(comment))
    .resolves
    .toStrictEqual({ id: '1', content: 'Test Comment', owner: 'Test User' });
    expect(poolSpy).toHaveBeenCalled();

    await expect(PostgresTestHelper.getCommentById(pool, '1')).resolves.toBeDefined();
  });
});
