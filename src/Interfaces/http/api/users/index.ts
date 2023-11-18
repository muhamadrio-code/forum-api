/* istanbul ignore file */
import Hapi from '@hapi/hapi'
import UserHandler from './handler'
import { container } from 'tsyringe'
import AddUserUseCase from '../../../../Applications/use_cases/AddUserUseCase'
import { routes } from './routes'

export const registerPlugin: Hapi.Plugin<any> = {
  name: "users",
  register: async (server) => {
    const handler = new UserHandler(container.resolve(AddUserUseCase))
    server.route(routes(handler))
  },
}