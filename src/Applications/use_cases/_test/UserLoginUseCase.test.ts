import AuthenticationError from "../../../Common/Errors/AuthenticationError";
import NotFoundError from "../../../Common/Errors/NotFoundError";
import AuthenticationRepository from "../../../Domains/authentications/AuthenticationRepository";
import UserRepository from "../../../Domains/users/UserRepository";
import AuthenticationTokenManager from "../../security/AuthenticationTokenManager";
import PasswordHash from "../../security/PasswordHash";
import Validator from "../../security/Validator";
import UserLoginUseCase from "../UserLoginUseCase";

describe('UserLoginUseCase', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let validator: jest.Mocked<Validator>;
  let authenticationRepository: jest.Mocked<AuthenticationRepository>;
  let passwordHash: jest.Mocked<PasswordHash>;
  let authenticationTokenManager: jest.Mocked<AuthenticationTokenManager>;

  beforeEach(() => {
    userRepository = {
      verifyUsernameAvailability: jest.fn(),
      addUser: jest.fn(),
      getIdByUsername: jest.fn().mockResolvedValue('userId'),
      getUserByUsername: jest.fn(),
      getUserPasswordByUsername: jest.fn().mockResolvedValue('encrypted password')
    };
    validator = {
      validatePayload: jest.fn().mockReturnValue({
        username: 'testuser',
        password: 'testpassword'
      })
    };
    authenticationRepository = {
      addToken: jest.fn(),
      deleteToken: jest.fn(),
      verifyToken: jest.fn()
    };
    passwordHash = {
      hash:jest.fn(),
      comparePassword: jest.fn().mockResolvedValue(true)
    };
    authenticationTokenManager = {
      createAccessToken: jest.fn().mockResolvedValue('accessToken'),
      createRefreshToken: jest.fn().mockResolvedValue('refreshToken'),
      decodePayload: jest.fn(),
      verifyRefreshToken: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should validate the payload and extract the username and password when executing the use case', async () => {
    const payload = {
      username: 'testuser',
      password: 'testpassword'
    };
    const useCase = new UserLoginUseCase(
      validator,
      userRepository,
      authenticationRepository,
      passwordHash,
      authenticationTokenManager
    );
    const spyGetUserPasswordByUsername = jest.spyOn(userRepository, 'getUserPasswordByUsername');
    const spyGetIdByUsername = jest.spyOn(userRepository, 'getIdByUsername');
    const encryptedPassword = await userRepository.getUserPasswordByUsername(payload.username);
    const id = await userRepository.getIdByUsername(payload.username);

    const result = await useCase.execute(payload);

    expect(validator.validatePayload).toHaveBeenCalledWith(payload);
    expect(spyGetUserPasswordByUsername).toHaveBeenCalledWith(payload.username);
    expect(passwordHash.comparePassword).toHaveBeenCalledWith(payload.password, encryptedPassword);
    expect(spyGetIdByUsername).toHaveBeenCalledWith(payload.username);
    expect(authenticationTokenManager.createAccessToken).toHaveBeenCalledWith({id, username: payload.username});
    expect(authenticationTokenManager.createRefreshToken).toHaveBeenCalledWith({id, username: payload.username});
    expect(result).toStrictEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
  });

  it('should throw AuthenticationError when execute with wrong password', async () => {
    const payload = {
      username: 'testuser',
      password: 'testpassword'
    };
    const passwordHash = {
      hash:jest.fn(),
      comparePassword: jest.fn().mockResolvedValue(false)
    };
    const useCase = new UserLoginUseCase(
      validator,
      userRepository,
      authenticationRepository,
      passwordHash,
      authenticationTokenManager
    );

    await expect(useCase.execute(payload)).rejects.toThrow(AuthenticationError);
  });

  it('should throw NotFoundError when execute with unregistered user', async () => {
    const payload = {
      username: 'unregistereduser',
      password: '123456'
    };
    const userRepository: jest.Mocked<UserRepository> = {
      verifyUsernameAvailability: jest.fn(),
      addUser: jest.fn(),
      getIdByUsername: jest.fn().mockResolvedValue('userId'),
      getUserByUsername: jest.fn(),
      getUserPasswordByUsername: jest.fn().mockRejectedValue(new NotFoundError("User tidak terdaftar"))
    };
    const passwordHash = {
      hash:jest.fn(),
      comparePassword: jest.fn().mockResolvedValue(false)
    };
    const useCase = new UserLoginUseCase(
      validator,
      userRepository,
      authenticationRepository,
      passwordHash,
      authenticationTokenManager
    );

    await expect(useCase.execute(payload)).rejects.toThrow(NotFoundError);
  });


});
