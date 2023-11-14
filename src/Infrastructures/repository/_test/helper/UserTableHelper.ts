/* istanbul ignore file */

export const UsersTableTestHelper = {
  async cleanTable(pool: any) {
    await pool.query('DELETE FROM users');
  },
};

