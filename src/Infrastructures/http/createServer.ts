import Hapi, { Plugin } from '@hapi/hapi';
import ClientError from '../../Common/Errors/ClientError';


export async function createServer(plugins?: Plugin<any>[]) {
  const server = Hapi.server({
      port: process.env.PORT,
      host: process.env.HOST
  });

  if(plugins) {
    await server.register(plugins)
  }

  server.ext('onPreResponse', (req, h) => {
    const { response } = req

    if(response instanceof Error) {
      if(response instanceof ClientError) {
        return h.response({
          success: false,
          message: response.message
        }).code(response.statusCode)
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue
  })

  return server
}

