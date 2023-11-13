import PasswordHash from "../PasswordHash";

describe('PasswordHash', () => {
  const passwordHash = new PasswordHash();

  it('should return a string hash of the input password', async () => {
    const password = 'password123';
    const result = await passwordHash.hash(password);
    expect(typeof result).toBe('string');
  });

  it('should generate a unique hash for each input password', async () => {
    const password1 = 'password123';
    const password2 = 'password456';
    const hash1 = await passwordHash.hash(password1);
    const hash2 = await passwordHash.hash(password2);
    expect(hash1).not.toBe(hash2);
  });

  it('should return true when comparing a plain password with its corresponding encrypted version', async () => {
    const password = 'password123';
    const hashedPassword = await passwordHash.hash(password);
    const result = await passwordHash.comparePassword(password, hashedPassword);
    expect(result).toBe(true);
  });

  it('should return false when comparing a plain password with a different encrypted version', async () => {
    const password1 = 'password123';
    const password2 = 'password456';
    const hashedPassword2 = await passwordHash.hash(password2);
    const result = await passwordHash.comparePassword(password1, hashedPassword2);
    expect(result).toBe(false);
  });
});

