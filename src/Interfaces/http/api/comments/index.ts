/* istanbul ignore file */
import Hapi from '@hapi/hapi';
import { container } from 'tsyringe';
import { routes } from './routes';
import ThreadCommentHandler from './handler';
import AddThreadCommentUseCase from '../../../../Applications/use_cases/AddThreadCommentUseCase';
import DeleteThreadCommentUseCase from '../../../../Applications/use_cases/DeleteThreadCommentUseCase';

export const threadsComments: Hapi.Plugin<any> = {
  name: "threads-comments",
  register: async (server) => {
    const handler = new ThreadCommentHandler(
      container.resolve(AddThreadCommentUseCase),
      container.resolve(DeleteThreadCommentUseCase),
    );
    server.route(routes(handler));
  },
};