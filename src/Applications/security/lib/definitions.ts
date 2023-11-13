export type UserPayload = {
  fullname: string,
  username: string,
  password: string
}

export type ValidationResult<T> = Readonly<T>
