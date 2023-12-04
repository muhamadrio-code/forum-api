export default abstract class Validator {
  abstract validatePayload<T>(payload: T): void
}