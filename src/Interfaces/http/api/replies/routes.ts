import ThreadCommentReplyHandler from './handler';

export const routes = (handler: ThreadCommentReplyHandler) => {
  return [
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