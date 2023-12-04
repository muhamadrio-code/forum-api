export type AuthenticationPayload = {
  readonly id: string,
  readonly username: string,
}

export type AuthenticationTokens = {
  readonly accessToken: string,
  readonly refreshToken: string
}