import Hapi, { Plugin } from '@hapi/hapi';
import ClientError from '../../Common/Errors/ClientError';
import Jwt, { HapiJwt } from '@hapi/jwt';


export async function createServer(plugins?: Plugin<any>[]) {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  await server.register(Jwt);
  server.auth.strategy("forumapi_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts: HapiJwt.Artifacts) => {
      return {
        isValid: true,
        credentials: {
          username: artifacts.decoded.payload.username,
        },
      };
    },
  });

  if (plugins) {
    await server.register(plugins);
  }

  server.ext('onPreResponse', (req, h) => {
    const { response } = req;
    if (response instanceof Error) {
      if(response.message === 'Missing authentication') {
        return h.response({
          status: 'fail',
          message: response.message
        }).code(401);
      }

      if (response instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: response.message
        }).code(response.statusCode);
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

    return h.continue;
  });

  return server;
}

