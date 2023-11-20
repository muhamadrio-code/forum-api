import AddUserUseCase from "../AddUserUseCase";
import { UserPayload } from "../../../Domains/entities/definitions";
import ZodUserValidator from "../../../Infrastructures/security/ZodUserValidator";
import UserRepository from "../../../Domains/users/UserRepository";
import PasswordHash from "../../security/PasswordHash";

describe('AddUserUseCase', () => {
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let validatorMock: jest.Mocked<ZodUserValidator>;
  let passwordHashMock: jest.Mocked<PasswordHash>;
  let addUserUseCase: AddUserUseCase;

  const payload: UserPayload = { fullname: 'John Doe', username: 'johndoe', password: 'password' };

  beforeEach(async () => {
    // Arrange
    userRepositoryMock = {
      verifyUsernameAvailability: jest.fn(),
      addUser: jest.fn(),
      getIdByUsername: jest.fn(),
      getUserByUsername: jest.fn(),
      getUserPasswordByUsername: jest.fn()
    };

    validatorMock = {
      validatePayload: jest.fn().mockReturnValue(payload),
    };

    passwordHashMock = {
      hash: jest.fn().mockReturnValue('hashedpassword'),
      comparePassword: jest.fn(),
    };

    addUserUseCase = new AddUserUseCase(userRepositoryMock, validatorMock, passwordHashMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate the payload schema before proceeding', async () => {
    // Act
    await addUserUseCase.execute(payload);

    // Assert
    expect(validatorMock.validatePayload)
      .toHaveBeenCalledWith({ fullname: 'John Doe', username: 'johndoe', password: 'password' });
  });

  it('should hash the payload.password before proceeding', async () => {
    // Act
    await addUserUseCase.execute(payload);

     // Assert
    expect(passwordHashMock.hash).toHaveBeenCalledWith('password');
  });

  it('should add the valid payload to the database', async () => {
    // Act
    await addUserUseCase.execute(payload);

     // Assert
    expect(userRepositoryMock.addUser).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.addUser)
    .toHaveBeenCalledWith({ id: expect.any(String), fullname: 'John Doe', username: 'johndoe', password: 'hashedpassword' });
  });
});
