/* istanbul ignore file */
import Hapi from "@hapi/hapi"
import { usersPlugin } from "./users"

export const plugins: Hapi.Plugin<any>[] = [
  // usersPlugin
]