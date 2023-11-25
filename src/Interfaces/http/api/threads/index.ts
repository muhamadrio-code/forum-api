/* istanbul ignore file */
import Hapi from '@hapi/hapi';
import { container } from 'tsyringe';
import { routes } from './routes';
import AddThreadUseCase from '../../../../Applications/use_cases/AddThreadUseCase';
import ThreadHandler from './handler';
import AddThreadCommentUseCase from '../../../../Applications/use_cases/AddThreadCommentUseCase';
import DeleteThreadCommentUseCase from '../../../../Applications/use_cases/DeleteThreadCommentUseCase';
import GetThreadDetailsUseCase from '../../../../Applications/use_cases/GetThreadDetailsUseCase';

export const threadsPlugin: Hapi.Plugin<any> = {
  name: "threads",
  register: async (server) => {
    const handler = new ThreadHandler(
      container.resolve(AddThreadUseCase),
      container.resolve(AddThreadCommentUseCase),
      container.resolve(DeleteThreadCommentUseCase),
      container.resolve(GetThreadDetailsUseCase),
    );
    server.route(routes(handler));
  },
};