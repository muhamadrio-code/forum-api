/* istanbul ignore file */
import Hapi from '@hapi/hapi';
import { container } from 'tsyringe';
import { routes } from './routes';
import AddThreadUseCase from '../../../../Applications/use_cases/AddThreadUseCase';
import ThreadHandler from './handler';
import GetThreadDetailsUseCase from '../../../../Applications/use_cases/GetThreadDetailsUseCase';

export const threads: Hapi.Plugin<any> = {
  name: "threads",
  register: async (server) => {
    const handler = new ThreadHandler(
      container.resolve(AddThreadUseCase),
      container.resolve(GetThreadDetailsUseCase),
    );
    server.route(routes(handler));
  },
};