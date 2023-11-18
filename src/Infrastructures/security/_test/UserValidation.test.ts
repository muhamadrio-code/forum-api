import ValidationError from "../../../Common/Errors/ValidationError";
import ZodUserValidator from "../ZodUserValidator";

describe('UserValidator', () => {

  it('should successfully validate a valid user payload', () => {
    const validator = new ZodUserValidator();
    const payload = {
      fullname: "John Doe",
      username: "johndoe",
      password: "password123"
    };
    const result = validator.validatePayload(payload);
    expect(result).toEqual(payload);
  });

  it('should return a readonly validated user payload', () => {
    const validator = new ZodUserValidator();
    const payload = {
      fullname: "John Doe",
      username: "johndoe",
      password: "password123"
    };
    const result = validator.validatePayload(payload);
    expect(Object.isFrozen(result.fullname)).toBe(true);
    expect(Object.isFrozen(result.username)).toBe(true);
    expect(Object.isFrozen(result.password)).toBe(true);
  });

  it('should handle minimum length values for fullname, username, and password', () => {
    const validator = new ZodUserValidator();
    const payload = {
      fullname: "John",
      username: "john",
      password: "passwwor"
    };
    const result = validator.validatePayload(payload);
    expect(result).toEqual(payload);
  });

  it('should throw a ValidationError for an invalid fullname', () => {
    const validator = new ZodUserValidator();
    const payload = {
      fullname: "",
      username: "johndoe",
      password: "password123"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow(ValidationError);
  });

  it('should throw a ValidationError for an invalid username', () => {
    const validator = new ZodUserValidator();
    const payload = {
      fullname: "John Doe",
      username: "j",
      password: "password123"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow(ValidationError);
  });

  it('should throw a ValidationError for an invalid password', () => {
    const validator = new ZodUserValidator();
    const payload = {
      fullname: "John Doe",
      username: "johndoe",
      password: "pass"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow(ValidationError);
  });
});
