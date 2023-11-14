import { RegisteredUser, User } from "../../Domains/entities/User";

export default abstract class UserRepository {
  abstract addUser(user: User): Promise<RegisteredUser>
  abstract getIdByUsername(username: string): Promise<string>
  abstract getUserByUsername(username: string): Promise<RegisteredUser>
}
