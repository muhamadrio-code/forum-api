/* eslint-disable @typescript-eslint/no-unused-vars */
import Validator from "../../Validator";

export default class ValidatorTest extends Validator {
  validatePayload<T>(payload: T): void {
    throw new Error('UNINPLEMENTED.ERROR');
  }
}