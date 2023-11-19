import { container } from "tsyringe";
import { pool } from "../../../Infrastructures/database/postgres/Pool";
import { createServer } from "../../../Infrastructures/http/createServer";
import { PostgresTestHelper } from "../../../Infrastructures/repository/_test/helper/PostgresTestHelper";
import { usersPlugin } from "../api/users";
import { registerDependenciesToContainer } from "../../../Infrastructures/lib/di";

describe('/users endpoint', () => {
  describe('POST /users, Test user registration flow', () => {
    beforeAll(() => {
      registerDependenciesToContainer()
    })
    
    afterAll(async () => {
      await pool.end();
      container.dispose()
    });

    beforeEach(async () => {
      await PostgresTestHelper.truncate({
        pool,
        tableName: 'users'
      });
    });

    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'lunatic',
        password: 'secret',
        fullname: 'Lunatic Indonesia',
      };
      const sut = usersPlugin
      const server = await createServer([sut]);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        password: 'secret',
      };

      const sut = usersPlugin
      const server = await createServer([sut]);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: ['Dicoding Indonesia'],
      };
      const sut = usersPlugin
      const server = await createServer([sut]);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const sut = usersPlugin
      const server = await createServer([sut]);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit 50 karakter');
    });


    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding indonesia',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const sut = usersPlugin
      const server = await createServer([sut]);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
    });

    it('should response 400 when username unavailable', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'super_secret',
      };
      await PostgresTestHelper.addUser(pool, {
        id: "user-1231",
        ...requestPayload
      })

      const sut = usersPlugin
      const server = await createServer([sut]);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });


      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak tersedia');
    });

    it('should response 400 when password is no longer enough', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'sup',
      };

      const sut = usersPlugin
      const server = await createServer([sut]);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter password kurang dari batas minimum 6 karakter');
    });

    it('should response 400 when fullname is empty', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        fullname: '',
        password: 'super_secret',
      };

      const sut = usersPlugin
      const server = await createServer([sut]);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username kurang dari batas minimum 4 karakter');
    });
  });
})