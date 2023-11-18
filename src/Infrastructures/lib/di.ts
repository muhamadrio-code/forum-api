import { container, instanceCachingFactory } from "tsyringe"
import UserRepositoryPostgres from "../repository/UserRepositoryPostgres"
import { pool } from "../database/postgres/Pool"
import ZodUserValidator from "../security/ZodUserValidator"
import BCryptPasswordHash from "../security/BCryptPasswordHash"

export function registerDependenciesToContainer() {
  container.register(
    "UserRepository",
    { useFactory: instanceCachingFactory(() => new UserRepositoryPostgres(pool)) }
  )
  container.register("UserValidator", { useClass: ZodUserValidator })
  container.register("PasswordHash", { useClass: BCryptPasswordHash })
}