import { container } from "tsyringe";
import { pool } from "../../../Infrastructures/database/postgres/Pool";
import { PostgresTestHelper } from "../../../Infrastructures/repository/_test/helper/PostgresTestHelper";
import { registerDependenciesToContainer } from "../../../Infrastructures/lib/di";
import { authenticationsPlugin } from "../api/authentications";
import { createServer } from "../../../Infrastructures/http/createServer";
import { usersPlugin } from "../api/users";
import Hapi from "@hapi/hapi";

describe('/authentications endpoint', () => {
  describe('POST /authentications, Test user login flow', () => {
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
      expect(responseJson.message).toEqual('harus mengirimkan username dan password');
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
})