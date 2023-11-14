import { Pool, QueryConfig } from "pg";
import { User,RegisteredUser } from "../../Domains/entities/User";
import UserRepository from "../../Domains/users/UserRepository";

export default class UserRepositoryPostgres extends UserRepository {
  private readonly pool:Pool;

  constructor(pool: Pool) {
    super()
    this.pool = pool
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
    const { rows } = await this.pool.query(query)
    const { id } = rows[0]
    return id as string
  }

  async getUserByUsername(username: string) {
    const query: QueryConfig = {
      text: "SELECT to_json(users.*)::jsonb - 'password' AS registered_user FROM users WHERE username=$1",
      values: [username]
    }
    const { rows:[result] } = await this.pool.query(query)

    return result.registered_user
  }
}