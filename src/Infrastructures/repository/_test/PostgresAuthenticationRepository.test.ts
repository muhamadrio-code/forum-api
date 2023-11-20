import InvariantError from "../../../Common/Errors/InvariantError";
import AuthenticationRepository from "../../../Domains/authentications/AuthenticationRepository";
import { pool } from "../../database/postgres/Pool";
import PostgresAuthenticationRepository from "../PostgresAuthenticationRepository";
import { PostgresTestHelper } from "./helper/PostgresTestHelper";

describe('PostgresAuthenticationRepository', () => {
  let authRepository: AuthenticationRepository;

  beforeAll(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: 'authentications'
    });
  });

  beforeEach(() => {
    authRepository = new PostgresAuthenticationRepository(pool);
  });

  afterEach(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: 'authentications'
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should call addToken method without errors', async () => {
    await expect(authRepository.addToken('testToken')).resolves.toBeUndefined();
    await expect(authRepository.verifyToken('testToken')).resolves.not.toThrow(InvariantError);
  });

  it('should run without errors when calling deleteToken with invalid token', async () => {
    await authRepository.addToken('test_token');
    await expect(authRepository.deleteToken('invalid_token')).resolves.toEqual(0);
  });

  it('should successfully delete token when calling deleteToken with valid token', async () => {
    await authRepository.addToken('test_token');
    await expect(authRepository.deleteToken('test_token')).resolves.toEqual(1);
    await expect(authRepository.verifyToken('test_token')).rejects.toThrow(InvariantError);
  });
});
