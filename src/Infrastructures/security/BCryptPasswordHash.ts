import bcrypt from 'bcrypt';
import PasswordHash from '../../Applications/security/PasswordHash';

export default class BCryptPasswordHash extends PasswordHash {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(plain: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(plain, encrypted);
  }
}