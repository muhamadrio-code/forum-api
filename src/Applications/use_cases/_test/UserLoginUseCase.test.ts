import AuthenticationRepository from "../../../Domains/authentications/AuthenticationRepository";
import { AuthenticationTokens } from "../../../Domains/entities/definitions";
import UserRepository from "../../../Domains/users/UserRepository";
import AuthenticationTokenManager from "../../security/AuthenticationTokenManager";
import PasswordHash from "../../security/PasswordHash";
import Validator from "../../security/Validator";
import UserLoginUseCase from "../UserLoginUseCase";

describe('UserLoginUseCase', () => {
  const payload = {
    username: 'testuser',
    password: 'testpassword'
  };

  let userRepository: jest.Mocked<UserRepository>;
  let validator: jest.Mocked<Validator>;
  let authenticationRepository: jest.Mocked<AuthenticationRepository>;
  let passwordHash: jest.Mocked<PasswordHash>;
  let authenticationTokenManager: jest.Mocked<AuthenticationTokenManager>;
  let useCase: UserLoginUseCase;

  beforeEach(() => {
    userRepository = {
      verifyUsernameAvailability: jest.fn(),
      addUser: jest.fn(),
      getIdByUsername: jest.fn().mockResolvedValue('userId'),
      getUserByUsername: jest.fn(),
      getUserPasswordByUsername: jest.fn().mockResolvedValue('encrypted password')
    };
    validator = {
      validatePayload: jest.fn()
    };
    authenticationRepository = {
      addToken: jest.fn(),
      deleteToken: jest.fn(),
      verifyToken: jest.fn()
    };
    passwordHash = {
      hash:jest.fn(),
      comparePassword: jest.fn().mockImplementation((password: string) => {
        return password === 'testpassword';
      })
    };
    authenticationTokenManager = {
      createAccessToken: jest.fn().mockResolvedValue('accessToken'),
      createRefreshToken: jest.fn().mockResolvedValue('refreshToken'),
      decodePayload: jest.fn(),
      verifyRefreshToken: jest.fn()
    };

    useCase = new UserLoginUseCase(
      validator,
      userRepository,
      authenticationRepository,
      passwordHash,
      authenticationTokenManager
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate the payload schema before proceeding', async () => {
    // Act
    await useCase.execute(payload);

    // Assert
    expect(validator.validatePayload).toHaveBeenCalledWith(payload);
  });

  it('should successfully compare the payload.password with encryptedPassword from the database', async () => {
    // Arange
    const encryptedPassword = await userRepository.getUserPasswordByUsername(payload.username);
    userRepository.getUserPasswordByUsername.mockClear();

    // Act
    await useCase.execute(payload);

    // Assert
    expect(userRepository.getUserPasswordByUsername).toHaveBeenCalledTimes(1);
    expect(userRepository.getUserPasswordByUsername).toHaveBeenCalledWith(payload.username);
    expect(passwordHash.comparePassword).toHaveBeenCalledWith(payload.password, encryptedPassword);
  });

  it('should successfully create new accessToken', async () => {
    // Arange
    const id = await userRepository.getIdByUsername(payload.username);
    userRepository.getUserPasswordByUsername.mockClear();

    // Act
    await useCase.execute(payload);

    // Assert
    expect(userRepository.getIdByUsername).toHaveBeenCalledWith(payload.username);
    expect(authenticationTokenManager.createAccessToken).toHaveBeenCalledWith({id, username: payload.username});
  });

  it('should successfully return accessToken and refreshToken', async () => {
    // Arange & Act
    const result = await useCase.execute(payload);

    // Assert
    expect(result).toStrictEqual({
      accessToken: "accessToken",
      refreshToken: "refreshToken"
    } as AuthenticationTokens);
  });

  it('should throw error when password and encrypted password are failed to compare', async () => {
    // Act & Assert
    await expect(useCase.execute({ username: payload.username, password: 'invalidpassword' }))
      .rejects
      .toThrow("kredensial yang Anda masukkan salah");
  });
});