import AuthenticationRepository from "../../../Domains/authentications/AuthenticationRepository";
import DeleteAuthenticationUseCase from "../DeleteAuthenticationUseCase";

describe('DeleteAuthenticationUseCase', () => {

  describe('should successfully delete authentication token with valid refresh token', () => {
    // Arrange
    const refreshToken = 'valid_refresh_token';

    const authenticationRepositoryMock: jest.Mocked<AuthenticationRepository> = {
      verifyToken: jest.fn(),
      addToken: jest.fn(),
      deleteToken: jest.fn(),
    };

    const validatorMock = {
      validatePayload: jest.fn(),
    };

    const useCase = new DeleteAuthenticationUseCase(
      authenticationRepositoryMock,
      validatorMock
    );

    it('should validate the payload schema before proceeding', async () => {
      // Act
      await useCase.execute(refreshToken);

      // Assert
      expect(validatorMock.validatePayload).toHaveBeenCalledWith(refreshToken);
    })

    it('should verify that refresh token is exist in the database', async () => {
      // Act
      await useCase.execute(refreshToken);

      // Assert
      expect(authenticationRepositoryMock.verifyToken).toHaveBeenCalledWith(refreshToken);
    })
    
    it('should successfully delete refresh token', async () => {
      // Act & Assert
      await expect(useCase.execute(refreshToken)).resolves.not.toThrow();
    })
  });
});
