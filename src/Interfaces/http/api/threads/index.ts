/* istanbul ignore file */
import Hapi from '@hapi/hapi';
import { container } from 'tsyringe';
import { routes } from './routes';
import AddThreadUseCase from '../../../../Applications/use_cases/AddThreadUseCase';
import ThreadHandler from './handler';
import AddThreadCommentUseCase from '../../../../Applications/use_cases/AddThreadCommentUseCase';

export const threadsPlugin: Hapi.Plugin<any> = {
  name: "threads",
  register: async (server) => {
    const handler = new ThreadHandler(
      container.resolve(AddThreadUseCase),
      container.resolve(AddThreadCommentUseCase),
    );
    server.route(routes(handler));
  },
};