import AuthenticationRepository from "../../../Domains/authentications/AuthenticationRepository";
import LogoutUserUseCase from "../UserLogoutUseCase";

describe('LogoutUserUseCase', () => {

  it('should delete token when valid refreshToken is provided', async () => {
    // Arrange
    const refreshToken = 'validRefreshToken';
    const authenticationRepository: jest.Mocked<AuthenticationRepository> = {
      deleteToken: jest.fn().mockResolvedValueOnce(1),
      verifyToken: jest.fn(),
      addToken: jest.fn(),
    };
    const logoutUserUseCase = new LogoutUserUseCase(authenticationRepository);
    // Act
    await logoutUserUseCase.execute(refreshToken);

    // Assert
    expect(authenticationRepository.deleteToken).toHaveBeenCalledWith(refreshToken);
  });

  it('should throw error when called with invalid token', async () => {
    // Arrange
    const refreshToken = 'invalidRefreshToken';
    const authenticationRepository: jest.Mocked<AuthenticationRepository> = {
      deleteToken: jest.fn().mockResolvedValueOnce(0),
      verifyToken: jest.fn(),
      addToken: jest.fn(),
    };
    const logoutUserUseCase = new LogoutUserUseCase(authenticationRepository);

    // Act and Assert
    await expect(logoutUserUseCase.execute(refreshToken)).rejects.toThrow("Refresh token tidak valid");
  });
});
