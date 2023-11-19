import Validator from "../../Applications/security/Validator";
import { z } from 'zod'
import ValidationError from "../../Common/Errors/ValidationError";

export default class ZodAuthenticationValidator extends Validator {
  validatePayload<String>(payload: String): Readonly<String> {
    const scheme = z.string({
      invalid_type_error: 'refresh token harus string',
      required_error: 'harus mengirimkan token refresh',
    }).min(1, {
      message: 'refresh token tidak boleh string kosong'
    }).trim()

    const result = scheme.safeParse(payload)

    if (!result.success) {
      const error = result.error.issues
        .map(({ message }) => message)
        
      
      throw new ValidationError(error[0])
    }

    return payload
  }
}