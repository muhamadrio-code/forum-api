import ValidationError from "../errors/ValidationError"

export type UserPayload = {
  fullname: string,
  username: string,
  password: string
}

export type ValidationResult<T> = { success: boolean } & (ValidationSuccess<T> | ValidationFailure)

export type ValidationSuccess<T> = {
  success: true,
  data: Readonly<Partial<T>>
}

export type ValidationFailure = {
  success: false,
  error: ValidationError
}