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
    }
  ];
};