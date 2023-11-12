import createServer from "./Infrastructures/http/createServer";

require('dotenv').config();

const startServer = async () => {
  const server = await createServer()
  await server.start()
  console.log('Server running on %s', server.info.uri);
} 

startServer()