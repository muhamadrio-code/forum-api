import AuthenticationRepositoryTest from './dummies/AuthenticationRepositoryTest';
import AuthenticationRepository from "../AuthenticationRepository";


describe('AuthenticationRepository', () => {
  it('should throw error when invoked', async () => {
    // Arrange
    const sut: AuthenticationRepository = new AuthenticationRepositoryTest();

    // Act & Assert
    await expect(sut.addToken('')).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.deleteToken('')).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.verifyToken('')).rejects.toThrow('UNINPLEMENTED.ERROR');
  });
});