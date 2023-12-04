import ZodAuthenticationValidator from "../ZodAuthenticationValidator";

describe('ZodAuthenticationValidator', () => {

  it('should validate a valid string payload successfully', () => {
    const validator = new ZodAuthenticationValidator();
    const payload = "valid string payload";

    expect(() => validator.validatePayload(payload)).not.toThrow();
  });

  it('should throw a ValidationError when payload is not a string', () => {
    const validator = new ZodAuthenticationValidator();
    const payload = 123;

    expect(() => validator.validatePayload(payload)).toThrow('refresh token harus string');
  });

  it('should throw a ValidationError when payload is an empty string', () => {
    const validator = new ZodAuthenticationValidator();
    const payload = "";

    expect(() => validator.validatePayload(payload)).toThrow('refresh token tidak boleh string kosong');
  });

  it('should throw if payload is undefined', () => {
    const validator = new ZodAuthenticationValidator();
    const payload = undefined;

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('harus mengirimkan token refresh');
  });

  it('should throw if payload is null', () => {
    const validator = new ZodAuthenticationValidator();
    const payload = null;

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('refresh token harus string');
  });

  it('should throw if payload is an empty object', () => {
    const validator = new ZodAuthenticationValidator();
    const payload = {};

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('refresh token harus string');
  });
});
