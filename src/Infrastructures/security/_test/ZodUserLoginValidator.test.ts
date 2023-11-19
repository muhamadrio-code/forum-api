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
      username: "j".repeat(4),
      password: "p".repeat(3)
    };
    const result = validator.validatePayload(payload);
    expect(result).toEqual(payload);
  });

  it('should throw a ValidationError for a very long username', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "j".repeat(1000),
      password: "password123"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('karakter username melebihi batas limit 50 karakter');
  });

  it('should throw a ValidationError for a very long password', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "johndoe",
      password: "a".repeat(1000)
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('karakter password melebihi batas limit 24 karakter');
  });

  it('should accept payloads with the maximum allowed length for username and password', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "a".repeat(50),
      password: "a".repeat(24)
    };
    const result = validator.validatePayload(payload);
    expect(result).toEqual(payload);
  });

  it('should throw a ValidationError if the payload contains a username with less than 4 characters', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "a",
      password: "validPassword"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('karakter username kurang dari batas minimum 4 karakter');
  });

  it('should throw a ValidationError if the payload contains a password with less than 3 characters', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "validUsername",
      password: "a"
    };
    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('karakter password kurang dari batas minimum 3 karakter');
  });

  it('should throw a ValidationError if payload is missing property', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      username: "validUsername"
    };

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow("harus mengirimkan password");
  });

  it('should handle empty payload', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {};

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow("harus mengirimkan username;\nharus mengirimkan password");
  });

  it('should handle payload with invalid data types', () => {
    const validator = new ZodUserLoginValidator();
    const payload = {
      fullname: "John Doe",
      username: 123,
      password: "password123"
    };

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow("username dan password harus string;\ntidak dapat login karena properti tidak sesuai");
  });

  it('should handle undefiend payload', () => {
    const validator = new ZodUserLoginValidator();
    const payload = undefined;

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('harus mengirimkan username dan password');
  });

  it('should handle null payload', () => {
    const validator = new ZodUserLoginValidator();
    const payload = null;

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('Invalid payload type');
  });

});
