/* istanbul ignore file */
import { Pool } from "pg";

type TableName = 'users' | 'authentications'

type Config = {
  pool: Pool, 
  tableName: TableName
}
export const PostgresTestHelper = {
  async truncate(config: Config) {
    const { pool, tableName } = config
    await pool.query(`TRUNCATE ${tableName}`);
  },
};
