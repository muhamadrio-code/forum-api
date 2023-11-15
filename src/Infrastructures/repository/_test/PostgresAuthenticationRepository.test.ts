import InvariantError from "../../../Common/Errors/InvariantError";
import AuthenticationRepository from "../../../Domains/authentications/AuthenticationRepository";
import { pool } from "../../database/postgres/Pool";
import PostgresAuthenticationRepository from "../PostgresAuthenticationRepository";
import { PostgresTestHelper } from "./helper/PostgresTestHelper";

describe('PostgresAuthenticationRepository', () => {
  let authRepository: AuthenticationRepository
  
  beforeAll(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tables: ['authentications']
    })
  })

  beforeEach(() => {
    authRepository = new PostgresAuthenticationRepository(pool);
  })

  afterEach(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tables: ['authentications']
    })
  })

  afterAll(async () => {
    await pool.end()
  })

  it('should be instance of AuthenticationRepository', () => {
    expect(authRepository).toBeInstanceOf(AuthenticationRepository);
  });

  it('should call addToken method without errors', async () => {
    await expect(authRepository.addToken('testToken')).resolves.toBeUndefined();
    await expect(authRepository.verifyToken('testToken')).resolves.not.toThrow(InvariantError)
  });

  it('should call deleteToken with valid token method without errors', async () => {
    await authRepository.addToken('test_token')
    await expect(authRepository.deleteToken('test_token')).resolves.toBeUndefined();
    await expect(authRepository.verifyToken('testToken')).rejects.toThrow(InvariantError)
  });

  it('should call deleteToken with invalid token method without errors', async () => {
    await authRepository.addToken('test_token')
    await expect(authRepository.deleteToken('invalid_token')).resolves.toBeUndefined();
  });
});
