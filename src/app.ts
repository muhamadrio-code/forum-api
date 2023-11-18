require('dotenv').config();
import "reflect-metadata";
import { createServer } from "./Infrastructures/http/createServer";
import { plugins } from "./Interfaces/http/api/plugins";
import { registerDependenciesToContainer } from "./Infrastructures/lib/di";

const startServer = async () => {
  registerDependenciesToContainer()
  const server = await createServer(plugins)
  await server.start()
  
  console.log('Server running on %s', server.info.uri);
}

startServer()