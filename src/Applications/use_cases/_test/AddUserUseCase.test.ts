import AddUserUseCase from "../AddUserUseCase";
import { UserPayload } from "../../../Domains/entities/definitions";
import ZodUserValidator from "../../../Infrastructures/security/ZodUserValidator";
import ValidationError from "../../../Common/Errors/ValidationError";
import UserRepository from "../../../Domains/users/UserRepository";
import PasswordHash from "../../security/PasswordHash";

describe('AddUserUseCase', () => {
  let userRepositoryMock: jest.Mocked<UserRepository>
  let validatorMock: jest.Mocked<ZodUserValidator>
  let passwordHashMock: jest.Mocked<PasswordHash>
  let addUserUseCase: AddUserUseCase

  beforeEach(() => {
    userRepositoryMock = {
      verifyUsernameAvailability: jest.fn(),
      addUser: jest.fn(),
      getIdByUsername: jest.fn(),
      getUserByUsername: jest.fn(),
      getUserPasswordByUsername: jest.fn()
    };

    validatorMock = {
      validatePayload: jest.fn().mockImplementation((arg: string) => {
        return new ZodUserValidator().validatePayload(arg)
      }),
    };
  
    passwordHashMock = {
      hash: jest.fn().mockImplementation((arg: string) => {
        return 'hashedpassword'
      }),
      comparePassword: jest.fn(),
    };

    addUserUseCase = new AddUserUseCase(userRepositoryMock, validatorMock, passwordHashMock)
  })

  it('should validate the payload and return a registered user when the payload is valid', async () => {
    // Arrange
    const payload: UserPayload = { fullname: 'John Doe', username: 'johndoe', password: 'password' }

    // Act
    await addUserUseCase.execute(payload);

    // Assert
    expect(validatorMock.validatePayload)
      .toHaveBeenCalledWith({ fullname: 'John Doe', username: 'johndoe', password: 'password' });
    expect(passwordHashMock.hash).toHaveBeenCalledWith('password');
    expect(userRepositoryMock.addUser).toHaveBeenCalledTimes(1)
    expect(userRepositoryMock.addUser)
    .toHaveBeenCalledWith({ id: expect.any(String), fullname: 'John Doe', username: 'johndoe', password: 'hashedpassword' })
  });

  it('should throw a ValidationError when the payload is not valid', async () => {
    // Arrange
    const payload: UserPayload = { fullname: 'John Doe', username: '', password: '' }

    //Act & Assert
    await expect(addUserUseCase.execute(payload)).rejects.toThrow(ValidationError)
  });
});
