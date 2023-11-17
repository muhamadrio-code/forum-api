import AuthenticationError from '../AuthenticationError'
import ClientError from '../ClientError';

describe('AuthenticationError', () => {

  it('should inherit from ClientError with status code 401 and name \'AuthenticationError\'', () => {
    const error = new AuthenticationError('message');
    expect(error instanceof ClientError).toBe(true);
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe('AuthenticationError');
  });

  it('should have a message property set to the passed message argument', () => {
    const message = 'message';
    const error = new AuthenticationError(message);
    expect(error.message).toBe(message);
  });

  it('should set the prototype to the AuthenticationError class prototype when creating a new instance', () => {
    const error = new AuthenticationError('This is an error message');
    expect(Object.getPrototypeOf(error)).toBe(AuthenticationError.prototype);
  });
});
