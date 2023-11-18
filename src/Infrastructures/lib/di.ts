import { container, instanceCachingFactory } from "tsyringe"
import UserRepositoryPostgres from "../repository/UserRepositoryPostgres"
import { pool } from "../database/postgres/Pool"
import UserValidator from "../security/UserValidator"
import BCryptPasswordHash from "../security/BCryptPasswordHash"

export function createContainerRegistry() {
  container.register(
    "UserRepositoryPostgres",
    { useFactory: instanceCachingFactory(() => new UserRepositoryPostgres(pool)) }
  )
  container.register("UserValidator", { useClass: UserValidator })
  container.register("BCryptPasswordHash", { useClass: BCryptPasswordHash })
}