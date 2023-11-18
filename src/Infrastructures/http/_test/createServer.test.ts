import { Plugin } from "@hapi/hapi";
import { createServer } from "../createServer";
import ClientError from "../../../Common/Errors/ClientError";

describe('HTTP server', () => {

  it('should handle routes correctly', async () => {
    // Arrange
    const plugin: Plugin<any> = {
      name: "test",
      register(server) {
        server.route({
          method: 'GET',
          path: '/path-test',
          handler: (req, h) => {
            return h.response({
              success: true,
            }).code(200)
          }
        })
      },
    }

    const server = await createServer([plugin]);
    
    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/path-test',
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(200);
    expect(responseJson.success).toBeTruthy();
  });

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer();
    
    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const plugin: Plugin<any> = {
      name: "test",
      register(server) {
        server.route({
          method: 'POST',
          path: '/test-path',
          handler: (req, h) => {
            throw new Error()
          }
        })
      },
    }

    const server = await createServer([plugin]);
    
    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/test-path',
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });

  it('should handle client error correctly', async () => {
    // Arrange
    const plugin: Plugin<any> = {
      name: "test",
      register(server) {
        server.route({
          method: 'POST',
          path: '/test-path',
          handler: (req, h) => {
            throw new ClientError("Message from client error")
          }
        })
      },
    }

    const server = await createServer([plugin]);
    
    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/test-path',
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.message).toEqual('Message from client error');
  });
});