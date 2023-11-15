export default abstract class AuthenticationRepository {
  abstract addToken(token: string) : Promise<void>
  abstract verifyToken(token: string) : Promise<void>
  abstract deleteToken(token: string): Promise<void>
}