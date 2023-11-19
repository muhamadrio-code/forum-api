/* istanbul ignore file */
import Hapi from "@hapi/hapi"
import { usersPlugin } from "./users"
import { authenticationsPlugin } from "./authentications"

export const plugins: Hapi.Plugin<any>[] = [
  usersPlugin,
  authenticationsPlugin
]