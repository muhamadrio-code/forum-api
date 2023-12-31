import { Pool, QueryConfig } from "pg";
import AuthenticationRepository from "../../Domains/authentications/AuthenticationRepository";
import InvariantError from "../../Common/Errors/InvariantError";

export default class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  async addToken(token: string) {
    const query: QueryConfig = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token]
    };

    await this.pool.query(query);
  }

  async deleteToken(token: string) {
    const query: QueryConfig = {
      text: "DELETE FROM authentications WHERE token=$1",
      values: [token]
    };

    const result = await this.pool.query(query);
    return result.rowCount || 0;
  }

  async verifyToken(token: string) {
    const query: QueryConfig = {
      text: "SELECT * FROM authentications WHERE token=$1",
      values: [token]
    };

    const { rowCount } = await this.pool.query(query);
    if (rowCount === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }
}