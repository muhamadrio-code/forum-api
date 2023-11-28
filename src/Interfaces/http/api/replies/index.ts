/* istanbul ignore file */
import Hapi from '@hapi/hapi';
import { container } from 'tsyringe';
import { routes } from './routes';
import ThreadCommentReplyHandler from './handler';
import AddCommentReplyuseCase from '../../../../Applications/use_cases/AddCommentReplyUseCase';
import DeleteThreadCommentReplyUseCase from '../../../../Applications/use_cases/DeleteCommentReplyUseCase';

export const threadsCommentReplies: Hapi.Plugin<any> = {
  name: "thread-comment-replies",
  register: async (server) => {
    const handler = new ThreadCommentReplyHandler(
      container.resolve(AddCommentReplyuseCase),
      container.resolve(DeleteThreadCommentReplyUseCase),
    );
    server.route(routes(handler));
  },
};