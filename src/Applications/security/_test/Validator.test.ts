import ValidatorTest from "./dummies/ValidatorTest";

describe('Validator', () => {
  it('should throw error when invoked', async () => {
    // Arrange
    const sut = new ValidatorTest();

    // Act & Assert
    expect(() => sut.validatePayload({})).toThrow('UNINPLEMENTED.ERROR');
  });
});