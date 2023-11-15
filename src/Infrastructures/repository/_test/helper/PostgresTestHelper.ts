/* istanbul ignore file */
import { Pool } from "pg";

type Table = 'users' | 'authentications'

type Config = {
  pool: Pool, 
  tables: Table[]
}
export const PostgresTestHelper = {
  async truncate(config: Config) {
    const { pool, tables } = config

    tables.forEach(async (table) => {
      await pool.query(`TRUNCATE TABLE ${table}`);
    })
  },
};
