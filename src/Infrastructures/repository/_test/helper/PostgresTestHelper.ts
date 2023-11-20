/* istanbul ignore file */
import { Pool } from "pg";

type TableName = 'users' | 'authentications'

type Config = {
  pool: Pool,
  tableName: TableName
}

export const PostgresTestHelper = {
  async addToken(pool: Pool, token:string) {
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token]
    };

    await pool.query(query);
  },
  async addUser(
    pool: Pool,
    user: {
      id: string,
      username: string,
      password: string,
      fullname: string,
    }
  ) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [user.id, user.fullname, user.username, user.password],
    };

    await pool.query(query);
  },
  async truncate(config: Config) {
    const { pool, tableName } = config;
    await pool.query(`TRUNCATE ${tableName}`);
  },
};
