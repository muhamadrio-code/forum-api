import { createServer } from '../../../Infrastructures/http/createServer';
import { registerDependenciesToContainer } from '../../../Infrastructures/lib/di';
import { pool } from '../../../Infrastructures/database/postgres/Pool';
import { AddedThread } from '../../../Domains/entities/Thread';
import { Server } from '@hapi/hapi';
import { plugins } from '../api/plugins';
import { PostgresTestHelper } from '../../../Infrastructures/repository/_test/helper/PostgresTestHelper';

describe("Threads", () => {

  let server: Server;
  let authorization: string;

  beforeAll(async () => {
    registerDependenciesToContainer();
    server = await createServer(plugins);

    // user sign up
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        fullname: 'my fullname',
        username: 'riopermana',
        password: 'secret',
      }
    });

    // user login
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'riopermana',
        password: 'secret',
      }
    });

    const response = JSON.parse(loginResponse.payload);
    authorization = 'Bearer ' + response.data.accessToken;
  });

  beforeEach(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: ['threads']
    });
  });

  afterAll(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: ['authentications', 'users']
    });

    await pool.end();
  });

  describe("POST /theads, test user add thread flow", () => {
    it('should response with status code 201 and return the added thread', async () => {
      // Arrange
      const payload = {
        title: "this is title",
        body: "this is body",
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization
        },
        payload
      });

      // Assert
      const responseJSON: {
        status: string,
        data: {
          addedThread: AddedThread
        }
      } = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJSON.status).toEqual('success');
      expect(responseJSON.data).toBeDefined();
      expect(responseJSON.data.addedThread).toStrictEqual({
        id: expect.any(String),
        title: "this is title",
        owner: "riopermana",
      });
    });

    it('should response with status code 400 when no authorization provided', async() => {
      // Arrange
      const payload = {
        title: "this is title",
        body: "this is body",
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload
      });
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toBeDefined();
    });

    it('should response with status code 400 if payload is not contain needed property', async() => {
      // Arrange
      const payload = {
        title: "this is title",
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization
        },
        payload
      });
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toBeDefined();
    });

    it('should response with status code 400 if payload is empty', async() => {
      // Arrange
      const payload = {};

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization
        },
        payload
      });
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toBeDefined();
    });

    it('should response with status code 400 if no payload defined', async() => {
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization
        },
      });
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toBeDefined();
    });

    it('should response with status code 400 if payload is define with wrong type', async() => {
      // Arange
      const payload = {
        title: "this is title",
        body: 1231,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization
        },
        payload
      });
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toBeDefined();
    });
  });
});