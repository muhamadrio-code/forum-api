export type UserPayload = {
  readonly fullname: string,
  readonly username: string,
  readonly password: string
}

export type ValidationResult<T> = Readonly<T>
