import { Pool, QueryConfig } from "pg";
import { User,RegisteredUser } from "../../Domains/entities/User";
import UserRepository from "../../Domains/users/UserRepository";
import NotFoundError from "../../Common/Errors/NotFoundError";
import InvariantError from "../../Common/Errors/InvariantError";

export default class UserRepositoryPostgres extends UserRepository {
  private readonly pool:Pool;

  constructor(pool: Pool) {
    super()
    this.pool = pool
  }

  async verifyUsernameAvailability(username: string) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser({id, fullname, username, password}: User) {
    const query: QueryConfig = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, fullname, username",
      values: [id, fullname, username, password]
    }
    const { rows } = await this.pool.query(query)
    
    return { ...rows[0] } as RegisteredUser
  }

  async getIdByUsername(username: string) {
    const query: QueryConfig = {
      text: "SELECT id FROM users WHERE username=$1",
      values: [username]
    }
    const { rows:[result] } = await this.pool.query(query)

    if(!result) throw new InvariantError('username tidak tersedia')

    const { id } = result
    return id as string
  }

  async getUserByUsername(username: string) {
    const query: QueryConfig = {
      text: "SELECT to_json(users.*)::jsonb - 'password' AS registered_user FROM users WHERE username=$1",
      values: [username]
    }
    const { rows:[result] } = await this.pool.query(query)

    if(!result) throw new InvariantError('username tidak tersedia')

    return result.registered_user
  }

  async getUserPasswordByUsername(username: string) {
    const query: QueryConfig = {
      text: "SELECT password FROM users WHERE username=$1",
      values: [username]
    }
    const { rows:[result] } = await this.pool.query(query)

    if(!result) throw new InvariantError('username tidak tersedia')

    return result.password as string
  }
}