import ClientError from "../ClientError";
import NotFoundError from "../NotFoundError";

describe('NotFoundError', () => {

  it('should set message and code properties correctly when creating a new instance with a message', () => {
    const errorMessage = 'This is an error message';
    const sut = new NotFoundError(errorMessage);
    expect(sut.message).toBe(errorMessage);
    expect(sut.statusCode).toBe(404);
  });

  it('should inherit from ClientError class', () => {
    const error = new NotFoundError('Not Found');
    expect(error instanceof ClientError).toBe(true);
  });

  it('should set the name property to \'NotFoundError\' when creating a new instance', () => {
    const sut = new NotFoundError('This is an error message');
    expect(sut.name).toBe('NotFoundError');
  });

  it('should set the prototype to the NotFoundError class prototype when creating a new instance', () => {
    const sut = new NotFoundError('This is an error message');
    expect(Object.getPrototypeOf(sut)).toBe(NotFoundError.prototype);
  });

  it('should have a status code of 404', () => {
    const error = new NotFoundError('Not Found');
    expect(error.statusCode).toBe(404);
  });
});