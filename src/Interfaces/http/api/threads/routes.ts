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
      method: 'GET',
      path: '/threads/{threadId}',
      handler: handler.getThreadDetailsHandler
    },
  ];
};