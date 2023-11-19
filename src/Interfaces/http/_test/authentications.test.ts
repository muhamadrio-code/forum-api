import { container } from "tsyringe";
import { pool } from "../../../Infrastructures/database/postgres/Pool";
import { PostgresTestHelper } from "../../../Infrastructures/repository/_test/helper/PostgresTestHelper";
import { registerDependenciesToContainer } from "../../../Infrastructures/lib/di";
import { authenticationsPlugin } from "../api/authentications";
import { createServer } from "../../../Infrastructures/http/createServer";
import { usersPlugin } from "../api/users";
import Hapi from "@hapi/hapi";
import { token } from "@hapi/jwt";
import { randomUUID } from "crypto";

describe('/authentications endpoint', () => {

  let server: Hapi.Server

    beforeAll(async () => {
      registerDependenciesToContainer()

      server = await createServer([usersPlugin, authenticationsPlugin]);
      await server.start()

      // Register new user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'aquamarine',
          password: 'secret',
          fullname: 'Aquamarine Ink',
        },
      });
    })

    afterAll(async () => {
      await PostgresTestHelper.truncate({
        pool,
        tableName: 'users'
      });
      await pool.end();
      await server.stop()
    });

    beforeEach(async () => {
      container.clearInstances()
      await PostgresTestHelper.truncate({
        pool,
        tableName: 'authentications'
      });
    });

  describe('POST /authentications, Test user login flow', () => {
    it('should successfully authenticate user and return access and refresh tokens', async () => {
      // Arrange
      const requestPayload = {
        username: 'aquamarine',
        password: 'secret',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it('should throw error "Password tidak sesuai" when login with invalid password', async () => {
      // Arrange
      const requestPayload = {
        username: 'aquamarine',
        password: 'secretzz',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('kredensial yang Anda masukkan salah');
      expect(response.statusCode).toEqual(401);
    });

    it('should throw error "username tidak ditemukan" if user not found', async () => {
      // Arrange
      const requestPayload = {
        username: 'aquama',
        password: 'secret',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak ditemukan');
      expect(response.statusCode).toEqual(400);
    });

    it('should throw error if payload is not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        username: 'aquamarine',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan password');
      expect(response.statusCode).toEqual(400);
    });

    it('should throw error if payload using wrong data type', async () => {
      // Arrange
      const requestPayload = {
        username: 'aquamarine',
        password: 12345678
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username dan password harus string');
    });
  });

  describe('PUT /authentications, Refresh authentication token flow', () => {
    it('should return 200 and new access token', async () => {
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'aquamarine',
          password: 'secret',
        },
      });
      const { data: { refreshToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
    });

    it('should return 400 payload not contain refresh token', async () => {
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan token refresh');
    });

    it('should return 400 if refresh token not string', async () => {
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 123,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token harus string');
    });

    it('should return 400 if refresh token not valid', async () => {
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 'invalid_refresh_token',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });

    it('should return 400 if refresh token not registered in database', async () => {
      const refreshToken = token.generate({ id: randomUUID(), username: "aquamarine" }, process.env.REFRESH_TOKEN_KEY!)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });
  });

  describe('DELETE /authentications, Test logout user flow', () => {
    let testInvalidRefreshToken: string;
    beforeAll(async () => {
      testInvalidRefreshToken = token.generate({ id: randomUUID(), username: "aquamarine" }, process.env.REFRESH_TOKEN_KEY!)
    })

    it('should response 200 if refresh token valid', async () => {
      // Arrange
      const server = await createServer([ authenticationsPlugin ]);
      const refreshToken = 'refresh_token';
      await PostgresTestHelper.addToken(pool, refreshToken);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      // Arrange
      const server = await createServer([ authenticationsPlugin ]);
      const refreshToken = token.generate({ id: randomUUID(), username: "aquamarine" }, process.env.REFRESH_TOKEN_KEY!)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });

    it('should response 400 if payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer([ authenticationsPlugin ]);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan token refresh');
    });

    it('should response 400 if refresh token not string', async () => {
      // Arrange
      const server = await createServer([ authenticationsPlugin ]);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: 123,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token harus string');
    });
  });
})