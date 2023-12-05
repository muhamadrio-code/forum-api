import ThreadRepository from '../ThreadRepository';
import ThreadRepositoryTest from './dummies/ThreadRepositoryTest';

describe('ThreadRepository', () => {
  it('should throw error when invoked', async () => {
    // Arrange
    const sut: ThreadRepository = new ThreadRepositoryTest();

    // Act & Assert
    // @ts-expect-error: no-check
    await expect(sut.addThread({})).rejects.toThrow('UNINPLEMENTED.ERROR');
    // @ts-expect-error: no-check
    await expect(sut.getThreadById({})).rejects.toThrow('UNINPLEMENTED.ERROR');
  });
});