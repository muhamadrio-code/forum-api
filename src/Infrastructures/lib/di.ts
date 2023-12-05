/* istanbul ignore file */

import { container, instanceCachingFactory } from "tsyringe";
import UserRepositoryPostgres from "../repository/UserRepositoryPostgres";
import { pool } from "../database/postgres/Pool";
import ZodUserValidator from "../security/ZodUserValidator";
import BCryptPasswordHash from "../security/BCryptPasswordHash";
import HapiJwtTokenManager from "../security/HapiJwtTokenManager";
import { token } from "@hapi/jwt";
import AuthenticationRepositoryPostgres from "../repository/AuthenticationRepositoryPostgres";
import ZodAuthenticationValidator from "../security/ZodAuthenticationValidator";
import ZodUserLoginValidator from "../security/ZodUserLoginValidator";
import ZodThreadValidator from "../security/ZodThreadValidator";
import ThreadRepositoryPostgres from "../repository/ThreadRepositoryPostgres";
import ZodThreadCommentValidator from "../security/ZodThreadCommentValidator";
import ThreadCommentRepositoryPostgres from "../repository/ThreadCommentRepositoryPostgres";
import CommentReplyRepositoryPostgres from "../repository/CommentReplyRepositoryPostgres";

export function registerDependenciesToContainer() {
  // Repository
  container.register(
    "UserRepository",
    { useFactory: instanceCachingFactory(() => new UserRepositoryPostgres(pool)) }
  );
  container.register(
    "AuthenticationRepository",
    { useFactory: instanceCachingFactory(() => new AuthenticationRepositoryPostgres(pool)) }
  );
  container.register(
    "ThreadRepository",
    { useFactory: instanceCachingFactory(() => new ThreadRepositoryPostgres(pool)) }
  );
  container.register(
    "ThreadCommentsRepository",
    { useFactory: instanceCachingFactory(() => new ThreadCommentRepositoryPostgres(pool)) }
  );
  container.register(
    "CommentReplyRepository",
    { useFactory: instanceCachingFactory(() => new CommentReplyRepositoryPostgres(pool)) }
  );

  // Validator
  container.register("UserValidator", { useClass: ZodUserValidator });
  container.register("UserLoginValidator", { useClass: ZodUserLoginValidator });
  container.register("AuthenticationValidator", { useClass: ZodAuthenticationValidator });
  container.register("ThreadValidator", { useClass: ZodThreadValidator });
  container.register("CommentValidator", { useClass: ZodThreadCommentValidator });

  // PasswordHash
  container.register("PasswordHash", { useClass: BCryptPasswordHash });

  // AuthenticationTokenManager
  container.register("AuthenticationTokenManager", { useFactory: () => new HapiJwtTokenManager(token)  });
}