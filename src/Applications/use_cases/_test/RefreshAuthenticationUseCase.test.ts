import AuthenticationRepository from "../../../Domains/authentications/AuthenticationRepository";
import AuthenticationTokenManager from "../../security/AuthenticationTokenManager";
import RefreshAuthenticationUseCase from "../RefreshAuthenticationUseCase";

describe('RefreshAuthenticationUseCase', () => {

  describe('should successfully refresh authentication token with valid refresh token', () => {
    // Arrange
    const refreshToken = 'valid_refresh_token';
    const accessToken = 'new_access_token';

    const authenticationRepositoryMock: jest.Mocked<AuthenticationRepository> = {
      verifyToken: jest.fn(),
      addToken: jest.fn(),
      deleteToken: jest.fn(),
    };

    const authenticationTokenManagerMock: jest.Mocked<AuthenticationTokenManager> = {
      verifyRefreshToken: jest.fn(),
      createRefreshToken: jest.fn(),
      decodePayload: jest.fn().mockResolvedValue({ username: 'test_user', id: '123' }),
      createAccessToken: jest.fn().mockResolvedValue(accessToken),
    };

    const validatorMock = {
      validatePayload: jest.fn(),
    };

    const useCase = new RefreshAuthenticationUseCase(
      authenticationRepositoryMock,
      authenticationTokenManagerMock,
      validatorMock
    );

    it('should validate the payload schema before proceeding', async () => {
      // Act
      await useCase.execute(refreshToken);

      // Assert
      expect(validatorMock.validatePayload).toHaveBeenCalledWith(refreshToken);
    });

    it('should verify the refreshToken format', async () => {
      // Act
      await useCase.execute(refreshToken);

      // Assert
      expect(authenticationTokenManagerMock.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
    });

    it('should verify that refresh token is exist in the database', async () => {
      // Act
      await useCase.execute(refreshToken);

      // Assert
      expect(authenticationRepositoryMock.verifyToken).toHaveBeenCalledWith(refreshToken);
    });

    it('should successfully return new access token', async () => {
      // Act
      const result = await useCase.execute(refreshToken);

      // Assert
      expect(authenticationTokenManagerMock.decodePayload).toHaveBeenCalledWith(refreshToken);
      expect(authenticationTokenManagerMock.createAccessToken).toHaveBeenCalledWith({
        username: 'test_user',
        id: '123',
      });
      expect(result).toBe(accessToken);
    });
  });
});
