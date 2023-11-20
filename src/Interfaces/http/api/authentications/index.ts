/* istanbul ignore file */
import Hapi from '@hapi/hapi';
import { container } from 'tsyringe';
import UserLogoutUseCase from "../../../../Applications/use_cases/UserLogoutUseCase";
import UserLoginUseCase from "../../../../Applications/use_cases/UserLoginUseCase";
import RefreshAuthenticationUseCase from "../../../../Applications/use_cases/RefreshAuthenticationUseCase";
import { routes } from './routes';
import AuthenticationHandler from './handler';

export const authenticationsPlugin: Hapi.Plugin<any> = {
  name: "authentications",
  register: async (server) => {
    const handler = new AuthenticationHandler(
      container.resolve(UserLoginUseCase),
      container.resolve(UserLogoutUseCase),
      container.resolve(RefreshAuthenticationUseCase),
    );
    server.route(routes(handler));
  },
};