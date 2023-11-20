import AuthenticationRepository from "../../../Domains/authentications/AuthenticationRepository";
import AuthenticationTokenManager from "../../security/AuthenticationTokenManager";
import Validator from "../../security/Validator";
import RefreshAuthenticationUseCase from "../RefreshAuthenticationUseCase";

describe('RefreshAuthenticationUseCase', () => {

  // Arrange
  const payload = 'valid_refresh_token';
  const accessToken = 'new_access_token';

  let authenticationRepositoryMock: jest.Mocked<AuthenticationRepository>;
  let authenticationTokenManagerMock: jest.Mocked<AuthenticationTokenManager>;
  let validatorMock: jest.Mocked<Validator>;
  let useCase: RefreshAuthenticationUseCase;

  beforeEach(async () => {
    authenticationRepositoryMock = {
      verifyToken: jest.fn(),
      addToken: jest.fn(),
      deleteToken: jest.fn(),
    };

    authenticationTokenManagerMock = {
      verifyRefreshToken: jest.fn(),
      createRefreshToken: jest.fn(),
      decodePayload: jest.fn().mockResolvedValue({ username: 'test_user', id: '123' }),
      createAccessToken: jest.fn().mockResolvedValue(accessToken),
    };

    validatorMock = {
      validatePayload: jest.fn(),
    };

    useCase = new RefreshAuthenticationUseCase(
      authenticationRepositoryMock,
      authenticationTokenManagerMock,
      validatorMock
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate the payload schema before proceeding', async () => {
    // Act
    await useCase.execute(payload);

    // Assert
    expect(validatorMock.validatePayload).toHaveBeenCalledWith(payload);
  });

  it('should verify the token format', async () => {
    // Act
    await useCase.execute(payload);

    // Assert
    expect(authenticationTokenManagerMock.verifyRefreshToken).toHaveBeenCalledWith(payload);
  });

  it('should verify that refresh token is exist in the database', async () => {
    // Act
    await useCase.execute(payload);

    // Assert
    expect(authenticationRepositoryMock.verifyToken).toHaveBeenCalledWith(payload);
  });

  it('should successfully decode the payload before proceeding', async () => {
    // Act
    await useCase.execute(payload);

    // Assert
    expect(authenticationTokenManagerMock.decodePayload).toHaveBeenCalledWith(payload);
  });

  it('should successfully return new access token', async () => {
    // Act
    const result = await useCase.execute(payload);

    // Assert
    expect(authenticationTokenManagerMock.createAccessToken).toHaveBeenCalledWith({
      username: 'test_user',
      id: '123',
    });
    expect(result).toBe(accessToken);
  });
});
