/* istanbul ignore file */
import Hapi from '@hapi/hapi';
import { container } from 'tsyringe';
import { routes } from './routes';
import ThreadCommentReplyHandler from './handler';
import AddCommentReplyUseCase from '../../../../Applications/use_cases/AddCommentReplyUseCase';
import DeleteCommentReplyUseCase from '../../../../Applications/use_cases/DeleteCommentReplyUseCase';

export const threadsCommentReplies: Hapi.Plugin<any> = {
  name: "thread-comment-replies",
  register: async (server) => {
    const handler = new ThreadCommentReplyHandler(
      container.resolve(AddCommentReplyUseCase),
      container.resolve(DeleteCommentReplyUseCase),
    );
    server.route(routes(handler));
  },
};