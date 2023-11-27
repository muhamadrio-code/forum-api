import ThreadHandler from './handler';

export const routes = (handler: ThreadHandler) => {
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
    {
      method: 'POST',
      path: '/threads/{threadId}/comments/{commentId}/replies',
      options: {
        auth: "forumapi_jwt"
      },
      handler: handler.postCommentReplyHandler
    },
    {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
      options: {
        auth: "forumapi_jwt"
      },
      handler: handler.deleteCommentReplyHandler
    },
  ];
};