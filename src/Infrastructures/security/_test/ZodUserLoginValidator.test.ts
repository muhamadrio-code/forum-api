import ValidationError from '../../../Common/Errors/ValidationError';
import ZodUserLoginValidator from  '../ZodUserLoginValidator'

describe('ZodUserLoginValidator', () => {
  it('should successfully validate a valid payload', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "johndoe",
      password: "password123"
    };
    const result = validator.validatePayload(payload);
    expect(result).toEqual(payload);
  });

  it('should return a readonly validated payload', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "johndoe",
      password: "password123"
    };
    const result = validator.validatePayload(payload);
    expect(Object.isFrozen(result.username)).toBe(true);
    expect(Object.isFrozen(result.password)).toBe(true);
  });

  it('should handle minimum length values for username, and password', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "john",
      password: "passwwor"
    };
    const result = validator.validatePayload(payload);
    expect(result).toEqual(payload);
  });

  it('should throw a ValidationError for an invalid username', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "j",
      password: "password123"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow(ValidationError);
  });

  it('should throw a ValidationError for a very long username', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "j".repeat(1000),
      password: "password123"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow(ValidationError);
  });

  it('should throw a ValidationError for an invalid password', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "johndoe",
      password: "pass"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow(ValidationError);
  });

  it('should throw a ValidationError for a very long password', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "johndoe",
      password: "a".repeat(1000)
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow(ValidationError);
  });
});
