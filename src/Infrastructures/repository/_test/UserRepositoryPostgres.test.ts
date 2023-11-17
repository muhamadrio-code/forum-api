import NotFoundError from "../../../Common/Errors/NotFoundError";
import { RegisteredUser, User } from "../../../Domains/entities/User";
import UserRepository from "../../../Domains/users/UserRepository";
import { pool } from "../../database/postgres/Pool";
import UserRepositoryPostgres from "../UserRepositoryPostgres";
import { PostgresTestHelper } from "./helper/PostgresTestHelper";

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepositoryPostgres(pool)
  })

  afterEach(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: 'users'
    })
  })

  afterAll(async () => {
    await pool.end();
  });

  it('should add a user to the database when addUser is called with complete user data and return RegisterdUser', async () => {
    // Arange
    const user: User = {
      id: "a",
      fullname: "rio permana",
      username: "riopermana",
      password: "123456"
    }
    const registeredUser = {
      id: "a",
      fullname: "rio permana",
      username: "riopermana",
    }

    // Action
    const result = await userRepository.addUser(user)

    // Assert
    expect(result).toStrictEqual(registeredUser)
  });

  it('should throw error when addUser is called with an existing username in the database', async () => {
    // Arange
    const user: User = {
      id: "a",
      fullname: "rio permana",
      username: "riopermana",
      password: "123456"
    }

    // Action
    await userRepository.addUser(user)

    // Assert
    await expect(userRepository.addUser(user)).rejects.toThrow()
  });

  it('should return the id of the user when getIdByUsername is called with a valid username', async () => {
    // Arange
    const user: User = {
      id: "a",
      fullname: "rio permana",
      username: "riopermana",
      password: "123456"
    }
    const username = "riopermana"

    // Action
    await userRepository.addUser(user)

    // Assert
    await expect(userRepository.getIdByUsername(username)).resolves.toBe("a")
  });

  it('should throw NotFoundError when getIdByUsername is called with a unregistered username', async () => {
    // Arange
    const user: User = {
      id: "a",
      fullname: "rio permana",
      username: "riopermana",
      password: "123456"
    }
    const username = "riopermana"

    // Action
    await userRepository.addUser(user)

    // Assert
    await expect(userRepository.getIdByUsername('username')).rejects.toThrow(NotFoundError)
  });

  it('should return RegisteredUser when getUserByUsername is called with a valid username', async () => {
    // Arange
    const user: User = {
      id: "a",
      fullname: "rio permana",
      username: "riopermana",
      password: "123456"
    }
    const username = "riopermana"
    const registeredUser: RegisteredUser = {
      id: "a",
      fullname: "rio permana",
      username: "riopermana",
    }

    // Action
    await userRepository.addUser(user)

    // Assert
    await expect(userRepository.getUserByUsername(username)).resolves.toStrictEqual(registeredUser)
  });

  it('should throw NotFoundError when getUserByUsername is called with a unregistered username', async () => {
    // Arange
    const user: User = {
      id: "a",
      fullname: "rio permana",
      username: "riopermana",
      password: "123456"
    }

    // Action
    await userRepository.addUser(user)

    // Assert
    await expect(userRepository.getUserByUsername('username')).rejects.toThrow(NotFoundError)
  });

  it('should return password when getUserPasswordByUsername is called with a valid username', async () => {
    // Arange
    const user: User = {
      id: "a",
      fullname: "rio permana",
      username: "riopermana",
      password: "123456"
    }

    // Action
    await userRepository.addUser(user)

    // Assert
    await expect(userRepository.getUserPasswordByUsername('riopermana')).resolves.toBe("123456")
  });

  it('should throw NotFoundError when getUserPasswordByUsername is called with a ivalid username', async () => {
    // Arange
    const user: User = {
      id: "a",
      fullname: "rio permana",
      username: "riopermana",
      password: "123456"
    }

    // Action
    await userRepository.addUser(user)

    // Assert
    await expect(userRepository.getUserPasswordByUsername('username')).rejects.toThrow(NotFoundError)
  });
  
});