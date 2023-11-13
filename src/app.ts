require('dotenv').config();
import createServer from "./Infrastructures/http/createServer";

const startServer = async () => {
  const server = await createServer()
  await server.start()
  console.log('Server running on %s', server.info.uri);
} 

startServer()