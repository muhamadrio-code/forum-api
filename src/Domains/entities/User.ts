export type User = {
  readonly id: string,
  readonly fullname: string,
  readonly username: string,
  readonly password: string,
}

export type RegisteredUser = Omit<User, "password">