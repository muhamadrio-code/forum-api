import UserValidator from "../UserValidator"
import ValidationError from "../../errors/ValidationError";

describe("Test user payload validation", () => {
  // should successfully validate a valid user payload
  it('should successfully validate a valid user payload', () => {
    const userValidator = new UserValidator();
    const payload = {
      fullname: "John Doe",
      username: "johndoe",
      password: "password"
    };
    const result = userValidator.validatePayload(payload)
    
    expect(result).toStrictEqual({ 
      success: true,
      data: payload
    })
  });

  // should return a success object with partial user payload data when validating a valid user payload
  it('should return a success object with partial user payload data when validating a valid user payload', () => {
    const userValidator = new UserValidator();
    const payload = {
      fullname: "John Doe",
      username: "johndoe",
      password: "password"
    };
    const result = userValidator.validatePayload(payload);
    expect(result).toStrictEqual({ 
      success: true,
      data: payload
    })
  });

  // should return an error object when validating an invalid user payload
  it('should return an error object when validating an invalid user payload', () => {
    const userValidator = new UserValidator();
    const payload = {
      fullname: "John Doe",
      username: "johndoe",
      password: ""
    };
    const result = userValidator.validatePayload(payload);
    expect(result).toStrictEqual({ 
      success: false,
      error: new ValidationError()
    })
  });

  // should return an error object when validating an empty user payload
  it('should return an error object when validating an empty user payload', () => {
    const userValidator = new UserValidator();
    const payload = {
      fullname: "",
      username: "",
      password: ""
    };
    const result = userValidator.validatePayload(payload);
    expect(result).toStrictEqual({ 
      success: false,
      error: new ValidationError()
    })
  });

  // should return an error object when validating a user payload with an empty fullname, username or password
  it('should return an error object when validating a user payload with an empty fullname, username or password', () => {
    const userValidator = new UserValidator();
    const payload = {
      fullname: "",
      username: "johndoe",
      password: "password"
    };
    const result = userValidator.validatePayload(payload);
    expect(result).toStrictEqual({ 
      success: false,
      error: new ValidationError()
    })
  });

  // should return an error object when validating a user payload with a fullname, username or password that exceeds the maximum allowed length
  it('should return an error object when validating a user payload with a fullname, username or password that exceeds the maximum allowed length', () => {
    const userValidator = new UserValidator();
    const payload = {
      fullname: "John Doe",
      username: "johndoe1234567890",
      password: "password1234567890"
    };
    const result = userValidator.validatePayload(payload);
    expect(result).toStrictEqual({ 
      success: false,
      error: new ValidationError()
    })
  });
})