import { createServer } from "../../../Infrastructures/http/createServer";
import { registerDependenciesToContainer } from "../../../Infrastructures/lib/di";
import { PostgresTestHelper } from "../../../Infrastructures/repository/_test/helper/PostgresTestHelper";
import { plugins } from "../api/plugins";
import { pool } from '../../../Infrastructures/database/postgres/Pool';
import { container } from "tsyringe";
import { Server } from "@hapi/hapi";


describe("Comment Reply", () => {

  let server: Server;
  let rioAuthorization: string;
  let threadId: string;
  let commentId: string;

  beforeAll(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: ['threads', 'thread_comments', 'users']
    });

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

    const loginResponseJSON = JSON.parse(loginResponse.payload);
    rioAuthorization = 'Bearer ' + loginResponseJSON.data.accessToken;

    // create thread
    const addThreadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      headers: {
        authorization: rioAuthorization
      },
      payload: {
        title: "this is title",
        body: "this is body",
      }
    });

    const { data } = JSON.parse(addThreadResponse.payload);
    threadId = data.addedThread.id;

    // add comment
    const addCommentResponse = await server.inject({
      method: 'POST',
      headers: {
        authorization: rioAuthorization
      },
      url: `/threads/${threadId}/comments`,
      payload: {
        content: "test comment"
      }
    });

    const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);
    commentId = addedComment.id;
  });

  afterAll(async () => {
    await pool.end();
    container.clearInstances();
  });

  describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should add reply successfully and return status code 201 and data', async () => {
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: rioAuthorization
        },
        payload: {
          content: 'test balasan'
        }
      });

      // Assert
      const responseJSON: {
        status: string,
        data: {
          addedReply: {
            id: string,
            content: string,
            owner: string,
          }
        }
      } = JSON.parse(response.payload);
      expect(response.statusCode).toBe(201);
      expect(responseJSON.status).toBe('success');
      expect(responseJSON.data).toBeDefined();
      expect(responseJSON.data.addedReply).toStrictEqual({
        id: expect.any(String),
        content: expect.any(String),
        owner: expect.any(String),
      });
    });

    it('should return status code 401 when add reply without authentication', async () => {
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'test balasan'
        }
      });

      // Assert
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);
      expect(response.statusCode).toBe(401);
      expect(responseJSON.status).toBe('fail');
      expect(responseJSON.message).toBeDefined();
    });

    it('should return status code 404 when add reply to invalid thread', async () => {
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/xxxx/replies`,
        headers: {
          authorization: rioAuthorization
        },
        payload: {
          content: 'test balasan'
        }
      });

      // Assert
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);
      expect(response.statusCode).toBe(404);
      expect(responseJSON.status).toBe('fail');
      expect(responseJSON.message).toBeDefined();
    });

    it('should return status code 404 when add reply with bad payload', async () => {
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: rioAuthorization
        },
        payload: {
          xxx: 'test balasan'
        }
      });

      // Assert
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(responseJSON.status).toBe('fail');
      expect(responseJSON.message).toBeDefined();
    });

    it('should return status code 400 when add reply with no payload', async () => {
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: rioAuthorization
        },
      });

      // Assert
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(responseJSON.status).toBe('fail');
      expect(responseJSON.message).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}/replies', () => {
    let replyId: string;

    beforeAll(async () => {
      // Add reply
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: rioAuthorization
        },
        payload: {
          content: 'test balasan'
        }
      });

      const { data } = JSON.parse(response.payload);
      replyId = data.addedReply.id;
    });

    it('should delete reply successfully and return status code 200', async () => {
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: rioAuthorization
        }
      });

      // Assert
      const responseJSON: {
        status: string,
      } = JSON.parse(response.payload);
      expect(response.statusCode).toBe(200);
      expect(responseJSON.status).toBe('success');
    });

    it('should return status code 404 when delete non-existed reply', async () => {
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/xxx`,
        headers: {
          authorization: rioAuthorization
        }
      });

      // Assert
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);
      expect(response.statusCode).toBe(404);
      expect(responseJSON.status).toBe('fail');
      expect(responseJSON.message).toBeDefined();
    });

    it("should return status code 403 when delete rio's reply using ririka's authorization", async () => {
      // Arange
      // user sign up as ririka
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          fullname: 'Ririka A.',
          username: 'ririka',
          password: 'secret',
        }
      });

      // user login as ririka
      const ririkaResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ririka',
          password: 'secret',
        }
      });
      const ririkaResponseJSON = JSON.parse(ririkaResponse.payload);
      const ririkaAuthorization = 'Bearer ' + ririkaResponseJSON.data.accessToken;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: ririkaAuthorization
        },
      });

      // Assert
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);
      expect(response.statusCode).toBe(403);
      expect(responseJSON.status).toBe('fail');
      expect(responseJSON.message).toBeDefined();
    });
  });
});