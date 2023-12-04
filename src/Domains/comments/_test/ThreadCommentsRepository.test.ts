import ThreadCommentsRepositoryTest from './dummies/ThreadCommentsRepositoryTest';
import ThreadCommentsRepository from '../ThreadCommentsRepository';

describe('ThreadCommentsRepository', () => {
  it('should throw error when invoked', async () => {
    // Arrange
    const sut: ThreadCommentsRepository = new ThreadCommentsRepositoryTest();

    // Act & Assert
    // @ts-expect-error: no-check
    await expect(sut.addComment({})).rejects.toThrow('UNINPLEMENTED.ERROR');
    // @ts-expect-error: no-check
    await expect(sut.addCommentReply({})).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.deleteComment('')).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.getCommentById('')).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.getCommentReplyById('')).rejects.toThrow('UNINPLEMENTED.ERROR');
  });
});