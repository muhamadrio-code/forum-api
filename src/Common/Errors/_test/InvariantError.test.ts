import ClientError from "../ClientError"
import InvariantError from "../InvariantError"

describe('InvariantError', () => {
    it('should set the message and name properties correctly when creating an instance with a message', () => {
      const message = 'Test error message'
      const error = new InvariantError(message)
      expect(error.message).toBe(message)
      expect(error.name).toBe('InvariantError')
    })

    it('should be instances of both InvariantError and ClientError', () => {
      const error = new InvariantError('Test error message')
      expect(error instanceof InvariantError).toBe(true)
      expect(error instanceof ClientError).toBe(true)
    })

    it('should have a statusCode property set to 400 by default', () => {
      const error = new InvariantError('Test error message')
      expect(error.statusCode).toBe(400)
    })

    it('should set the prototype to the ValidationError class prototype when creating a new instance', () => {
      const validationError = new InvariantError('This is an error message')
      expect(Object.getPrototypeOf(validationError)).toBe(InvariantError.prototype)
    })
})
