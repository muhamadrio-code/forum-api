import ValidationError from "../ValidationError";

describe('ValidationError', () => {

  it('should set message and code properties correctly when creating a new instance with a message', () => {
    const errorMessage = 'This is an error message';
    const validationError = new ValidationError(errorMessage);
    expect(validationError.message).toBe(errorMessage);
    expect(validationError.code).toBe(500);
  });

  it('should set the name property to \'ValidationError\' when creating a new instance', () => {
    const validationError = new ValidationError('This is an error message');
    expect(validationError.name).toBe('ValidationError');
  });

  it('should set the prototype to the ValidationError class prototype when creating a new instance', () => {
    const validationError = new ValidationError('This is an error message');
    expect(Object.getPrototypeOf(validationError)).toBe(ValidationError.prototype);
  });
});
