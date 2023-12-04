import ValidationError from "../../../Common/Errors/ValidationError";
import ZodUserValidator from "../ZodUserValidator";

describe('ZodUserValidator', () => {

  it('should successfully validate a valid user payload', () => {
    const validator = new ZodUserValidator();
    const payload = {
      fullname: "John Doe",
      username: "johndoe",
      password: "password123"
    };
    expect(() => validator.validatePayload(payload)).not.toThrow();
  });

  it('should handle minimum length values for fullname, username, and password', () => {
    const validator = new ZodUserValidator();
    const payload = {
      fullname: "John",
      username: "john",
      password: "passwwor"
    };
    expect(() => validator.validatePayload(payload)).not.toThrow();
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

  it('should throw a ValidationError if the payload contains a password with less than minimum characters', () => {
    const validator = new ZodUserValidator();
    const payload = {
      fullname: "John Doe",
      username: "johndoe",
      password: "p"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow(ValidationError);
  });

  it('should throw a ValidationError for an username contain restricted character(s)', () => {
    const validator = new ZodUserValidator();
    const payload = {
      fullname: "John Doe",
      username: "johndoe()",
      password: "password"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('username mengandung karakter terlarang');
  });

  it('should handle empty payload', () => {
    const validator = new ZodUserValidator();
    const payload = {};
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow(ValidationError);
  });

  it('should handle payload with missing properties', () => {
    const validator = new ZodUserValidator();
    const payload = {
      fullname: "John Doe"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow("tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada;\ntidak dapat membuat user baru karena properti yang dibutuhkan tidak ada");
  });

  it('should handle payload with invalid data types', () => {
    const validator = new ZodUserValidator();
    const payload = {
      fullname: "John Doe",
      username: 123,
      password: "password123"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow(ValidationError);
  });

});
