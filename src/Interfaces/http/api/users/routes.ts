import Hapi from '@hapi/hapi'
import UserHandler from './handler'

export const routes: (handler: UserHandler) => Hapi.ServerRoute[] = (handler: UserHandler) => {
  return [
    {
      method: 'POST',
      path: '/register',
      handler: handler.postUserhandler
    }
  ]
}