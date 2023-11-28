/* istanbul ignore file */

import Hapi from "@hapi/hapi";
import { users } from "./users";
import { authentications } from "./authentications";
import { threads } from "./threads";
import { threadsComments } from "./comments";
import { threadsCommentReplies } from "./replies";

export const plugins: Hapi.Plugin<any>[] = [
  users,
  authentications,
  threads,
  threadsComments,
  threadsCommentReplies
];