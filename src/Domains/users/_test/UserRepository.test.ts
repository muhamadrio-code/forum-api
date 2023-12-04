import UserRepository from '../UserRepository';
import UserRepositoryTest from './dummies/UserRepositoryTest';

describe('UserRepository', () => {
  it('should throw error when invoked', async () => {
    // Arrange
    const sut: UserRepository = new UserRepositoryTest();

    // Act & Assert
    // @ts-expect-error: no-check
    await expect(sut.addUser({})).rejects.toThrow('UNINPLEMENTED.ERROR');
    // @ts-expect-error: no-check
    await expect(sut.getIdByUsername({})).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.getUserByUsername('')).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.getUserPasswordByUsername('')).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.verifyUsernameAvailability('')).rejects.toThrow('UNINPLEMENTED.ERROR');
  });
});