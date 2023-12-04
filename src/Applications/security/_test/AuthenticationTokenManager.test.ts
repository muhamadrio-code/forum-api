import AuthenticationTokenManagerTest from "./dummies/AuthenticationTokenManagerTests";

describe('AuthenticationTokenManager', () => {
  it('should throw error when invoked', async () => {
    // Arrange
    const sut = new AuthenticationTokenManagerTest();

    // Act & Assert
    await expect(sut.createAccessToken({id: '', username: ''})).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.createRefreshToken({id: '', username: ''})).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.decodePayload('')).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.verifyRefreshToken('')).rejects.toThrow('UNINPLEMENTED.ERROR');
  });
});