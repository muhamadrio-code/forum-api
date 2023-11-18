/* istanbul ignore file */
import Hapi from "@hapi/hapi"
import { registerPlugin } from "./users"

export const plugins: Hapi.Plugin<any>[] = [
  registerPlugin
]