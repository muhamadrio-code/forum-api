import PasswordHashTest from "./dummies/PasswordHashTest";

describe('PasswordHash', () => {
  it('should throw error when invoked', async () => {
    // Arrange
    const sut = new PasswordHashTest();

    // Act & Assert
    await expect(sut.comparePassword("", "")).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.hash("")).rejects.toThrow('UNINPLEMENTED.ERROR');
  });
});