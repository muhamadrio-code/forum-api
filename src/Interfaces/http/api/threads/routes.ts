import Hapi from '@hapi/hapi';
import UserHandler from './handler';
import ThreadHandler from './handler';

export const routes: (handler: UserHandler) => Hapi.ServerRoute[] = (handler: ThreadHandler) => {
  return [
    {
      method: 'POST',
      path: '/threads',
      options: {
        auth: "forumapi_jwt"
      },
      handler: handler.postThreadhandler
    },
    {
      method: 'POST',
      path: '/threads/{threadId}/comments',
      options: {
        auth: "forumapi_jwt"
      },
      handler: handler.postThreadCommenthandler
    },
    {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}',
      options: {
        auth: "forumapi_jwt"
      },
      handler: handler.deleteThreadCommenthandler
    },
    {
      method: 'GET',
      path: '/threads/{threadId}',
      handler: handler.getThreadDetailsHandler
    },
  ];
};