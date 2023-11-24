import { createServer } from '../../../Infrastructures/http/createServer';
import { registerDependenciesToContainer } from '../../../Infrastructures/lib/di';
import { pool } from '../../../Infrastructures/database/postgres/Pool';
import { AddedThread } from '../../../Domains/entities/Thread';
import { Server } from '@hapi/hapi';
import { plugins } from '../api/plugins';
import { PostgresTestHelper } from '../../../Infrastructures/repository/_test/helper/PostgresTestHelper';
import { AddedComment } from '../../../Domains/entities/Comment';

describe("Threads", () => {

  let server: Server;
  let authorization: string;

  beforeAll(async () => {
    await PostgresTestHelper.truncate({
      pool,
      tableName: ['authentications', 'users']
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

    const response = JSON.parse(loginResponse.payload);
    authorization = 'Bearer ' + response.data.accessToken;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("POST /threads, test user add thread flow", () => {
    beforeEach(async () => {
      await PostgresTestHelper.truncate({
        pool,
        tableName: ['threads']
      });
    });

    it('should persist the thread', async () => {
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
      const { id } = responseJSON.data.addedThread;
      await expect(PostgresTestHelper.getThreadById(pool, id)).resolves.toHaveProperty("id", expect.any(String));
    });

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

    it('should response with status code 400 when no authorization provided', async () => {
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

    it('should response with status code 400 if payload is not contain needed property', async () => {
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

    it('should response with status code 400 if payload is empty', async () => {
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

    it('should response with status code 400 if no payload defined', async () => {
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

    it('should response with status code 400 if payload is define with wrong type', async () => {
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

  describe("POST /threads/{threadId}/comments, test user add comment to a thread flow", () => {
    beforeEach(async () => {
      await PostgresTestHelper.truncate({
        pool,
        tableName: ['threads']
      });
    });

    afterAll(async () => {
      // Cleanup
      await PostgresTestHelper.truncate({
        pool,
        tableName: 'thread_comments'
      });
    });

    it('should response with status code 201 and return the AddedComment object', async () => {
      // Arrange
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization
        },
        payload: {
          title: "this is title",
          body: "this is body",
        }
      });

      const { data } = JSON.parse(addThreadResponse.payload);
      const threadId = data.addedThread.id;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization
        },
        payload: {
          content: "this is comment content",
        }
      });

      // Assert
      const responseJSON: {
        status: string,
        data: {
          addedComment: AddedComment
        }
      } = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJSON.status).toEqual('success');
      expect(responseJSON.data).toBeDefined();
      expect(responseJSON.data.addedComment).toStrictEqual({
        id: expect.any(String),
        content: "this is comment content",
        owner: "riopermana",
      });
    });

    it('should response with status code 400 if comment doesnt have required property', async () => {
      // Arrange
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization
        },
        payload: {
          title: "this is title",
          body: "this is body",
        }
      });

      const { data } = JSON.parse(addThreadResponse.payload);
      const threadId = data.addedThread.id;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization
        },
        payload: {}
      });

      // Assert
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toBeDefined();
    });

    it('should response with status code 400 if user not authorized', async () => {
      // Arrange
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization
        },
        payload: {
          title: "this is title",
          body: "this is body",
        }
      });

      const { data } = JSON.parse(addThreadResponse.payload);
      const threadId = data.addedThread.id;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: "this is comment content",
        }
      });

      // Assert
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toBeDefined();
    });

    it('should response with status code 400 if no payload', async () => {
      // Arrange
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization
        },
        payload: {
          title: "this is title",
          body: "this is body",
        }
      });

      const { data } = JSON.parse(addThreadResponse.payload);
      const threadId = data.addedThread.id;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization
        }
      });

      // Assert
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toBeDefined();
    });

    it('should throw error with code 404 if trying to add comment on a non-existent thread', async () => {
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/invalid_id/comments`,
        headers: {
          authorization
        },
        payload: {
          content: "this is comment content",
        }
      });

      // Assert
      const responseJSON: {
        status: string,
        message: string
      } = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toBeDefined();
    });
  });

  describe("POST /threads/{threadId}/comments/{commentId}, test user delete comment from a thread", () => {
    let threadId: string;

    beforeAll(async () => {
      // Cleanup
      await PostgresTestHelper.truncate({
        pool,
        tableName: ['thread_comments', 'threads']
      });

      // create thread
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization
        },
        payload: {
          title: "this is title",
          body: "this is body",
        }
      });

      const { data } = JSON.parse(addThreadResponse.payload);
      threadId = data.addedThread.id;
    });

    it('should successfully soft-delete comment and response with status code 200 and return the content', async () => {
      // Arange
      // add comment
      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization
        },
        payload: {
          content: "this is comment content",
        }
      });

      const result: {
        success: string,
        data: {
          addedComment: {
            id: string, content: string, owner: string
          }
        }
      } = JSON.parse(addCommentResponse.payload);
      const commentId = result.data.addedComment.id;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization
        },
      });

      // Assert
      const responseJSON: { content: string } = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJSON.content).toBeDefined();
    });

    it('should response with status code 404 when try to delete non-existed comment', async () => {
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/invalid_id`,
        headers: {
          authorization
        },
      });

      // Assert
      const responseJSON: { status: string, message: string } = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toBeDefined();
    });

    it('should response with status code 403 when not the owner try to delete a comment', async () => {
      // Arange
      // sign up new user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          fullname: 'lumi',
          username: 'lumilumi',
          password: 'secret',
        }
      });

      // user login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'lumilumi',
          password: 'secret',
        }
      });

      const lumiLoginJSON = JSON.parse(loginResponse.payload);
      const lumiAuth = 'Bearer ' + lumiLoginJSON.data.accessToken;

      // Add comment as riopermana
      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization // authorized as riopermana
        },
        payload: {
          content: "this is comment content",
        }
      });

      const result: {
        success: string,
        data: {
          addedComment: {
            id: string, content: string, owner: string
          }
        }
      } = JSON.parse(addCommentResponse.payload);
      const commentId = result.data.addedComment.id;

      // Action
      // lumi try to delete comment that owned by riopermana
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: lumiAuth // authorized as lumi
        },
      });

      // Assert
      const responseJSON: { status: string, message: string } = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toBeDefined();
    });
  });
});