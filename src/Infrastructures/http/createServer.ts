import Hapi from '@hapi/hapi';
import { request } from 'http';

export default async function createServer() {
  const server = Hapi.server({
      port: process.env.PORT,
      host: process.env.HOST
  });

  await server.start();
  return server
}
