/* istanbul ignore file */

import { QueryConfig, Pool } from "pg";

type Config = {
  pool: Pool, 
  tables: 'users'[] | 'authentications'[]
}
export const PostgresTestHelper = {
  async truncate(config: Config) {
    const { pool, tables } = config

    tables.forEach(async (table) => {
      await pool.query(`TRUNCATE TABLE ${table}`);
    })
  },
};
