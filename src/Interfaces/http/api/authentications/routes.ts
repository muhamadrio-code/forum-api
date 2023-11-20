import Hapi from '@hapi/hapi';
import UserHandler from './handler';
import AuthenticationHandler from './handler';

export const routes: (handler: AuthenticationHandler) => Hapi.ServerRoute[] = (handler: UserHandler) => {
  return [
    {
      method: 'POST',
      path: '/authentications',
      handler: handler.postAuthenticationHandler,
    },
    {
      method: 'PUT',
      path: '/authentications',
      handler: handler.putAuthenticationHandler,
    },
    {
      method: 'DELETE',
      path: '/authentications',
      handler: handler.deleteAuthenticationHandler,
    },
  ];
};