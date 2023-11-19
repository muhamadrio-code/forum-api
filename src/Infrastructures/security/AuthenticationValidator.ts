import Validator from "../../Applications/security/Validator";
import { z } from 'zod'
import ValidationError from "../../Common/Errors/ValidationError";

export default class AuthenticationValidator extends Validator {
  validatePayload<String>(payload: String): Readonly<String> {
    const scheme = z.string({
      invalid_type_error: 'refresh token harus string',
      required_error: 'harus mengirimkan token refresh',
    })
    const result = scheme.safeParse(payload)

    if (!result.success) {
      const error = result.error.issues
        .map(({ message }) => message)
        .reduce((prev, curr) => prev + ';\n' + curr)
      throw new ValidationError(error)
    }

    return payload
  }
}