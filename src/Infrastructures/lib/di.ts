import { container, instanceCachingFactory } from "tsyringe"
import UserRepositoryPostgres from "../repository/UserRepositoryPostgres"
import { pool } from "../database/postgres/Pool"
import ZodUserValidator from "../security/ZodUserValidator"
import BCryptPasswordHash from "../security/BCryptPasswordHash"
import HapiJwtTokenManager from "../security/HapiJwtTokenManager"
import { token } from "@hapi/jwt"
import PostgresAuthenticationRepository from "../repository/PostgresAuthenticationRepository"
import ZodAuthenticationValidator from "../security/ZodAuthenticationValidator"
import ZodUserLoginValidator from "../security/ZodUserLoginValidator"

export function registerDependenciesToContainer() {
  // Repository
  container.register(
    "UserRepository",
    { useFactory: instanceCachingFactory(() => new UserRepositoryPostgres(pool)) }
  )
  container.register(
    "AuthenticationRepository",
    { useFactory: instanceCachingFactory(() => new PostgresAuthenticationRepository(pool)) }
  )

  // Validator
  container.register("UserValidator", { useClass: ZodUserValidator })
  container.register("UserLoginValidator", { useClass: ZodUserLoginValidator })
  container.register("AuthenticationValidator", { useClass: ZodAuthenticationValidator })

  // PasswordHash
  container.register("PasswordHash", { useClass: BCryptPasswordHash })

  // AuthenticationTokenManager
  container.register("AuthenticationTokenManager", { useFactory: (c) => new HapiJwtTokenManager(token)  })
}