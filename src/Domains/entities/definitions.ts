export type UserPayload = {
  readonly fullname: string,
  readonly username: string,
  readonly password: string
}

export type ValidationResult<T> = Readonly<T>

export type UserLoginPayload = Omit<UserPayload, 'fullname'>

export type AuthenticationPayload = {
  readonly id: string,
  readonly username: string,
}

export type AuthenticationTokens = {
  readonly accessToken: string,
  readonly refreshToken: string
}