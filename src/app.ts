require('dotenv').config();
import Hapi from '@hapi/hapi';

const init = async () => {

  const server = Hapi.server({
      port: process.env.PORT,
      host: process.env.HOST
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init()