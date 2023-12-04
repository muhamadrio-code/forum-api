export type User = {
  readonly id: string,
  readonly fullname: string,
  readonly username: string,
  readonly password: string,
}

export type RegisteredUser = Omit<User, "password">

export type UserPayload = {
  readonly fullname: string,
  readonly username: string,
  readonly password: string
}

export type UserLoginPayload = Omit<UserPayload, 'fullname'>