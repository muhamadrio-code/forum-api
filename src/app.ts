// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import "reflect-metadata";
import { createServer } from "./Infrastructures/http/createServer";
import { plugins } from "./Interfaces/http/api";
import { registerDependenciesToContainer } from "./Infrastructures/lib/di";

const startServer = async () => {
  registerDependenciesToContainer();
  const server = await createServer();
  await server.start();

  // eslint-disable-next-line no-console
  console.log('Server berjalan di %s', server.info.uri);
};

startServer();
