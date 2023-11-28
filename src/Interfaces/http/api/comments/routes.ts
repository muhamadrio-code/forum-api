import ThreadCommentHandler from './handler';

export const routes = (handler: ThreadCommentHandler) => {
  return [
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
  ];
};