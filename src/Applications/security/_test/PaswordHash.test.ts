import PasswordHash from "../PasswordHash";

describe('hash', () => {

  // Returns a string hash of the input password.
  it('should return a string hash of the input password', async () => {
    const password = 'password123';
    const passwordHash = new PasswordHash();
    const result = await passwordHash.hash(password);
    expect(typeof result).toBe('string');
  });

  // The generated hash is unique for each input password.
  it('should generate a unique hash for each input password', async () => {
    const password1 = 'password123';
    const password2 = 'password456';
    const passwordHash = new PasswordHash();
    const hash1 = await passwordHash.hash(password1);
    const hash2 = await passwordHash.hash(password2);
    expect(hash1).not.toBe(hash2);
  });

  // The method throws an error if the input password is an empty string.
  it('should throw an error if the input password is an empty string', async () => {
    const password = '';
    const passwordHash = new PasswordHash();
    await expect(passwordHash.hash(password)).rejects.toThrow();
  });

  // The method throws an error if the input password is too long.
  it('should throw an error if the input password is too long', async () => {
    const password = 'a'.repeat(1000);
    const passwordHash = new PasswordHash();
    await expect(passwordHash.hash(password)).rejects.toThrow();
  });
});

