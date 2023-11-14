export default abstract class PasswordHash {
  abstract hash(password: string): Promise<string>

  abstract comparePassword(plain: string, encrypted: string): Promise<boolean> 
}