import { AddThreadPayload, AddedThread, Thread, ThreadDetailsEntity, ThreadEntity, ThreadPayload } from "../entities";

describe("threads entities", () => {
  it("should create Thread object with readonly properties", () => {
    const thread: Thread = {
      id: 'id-123',
      title: 'my fullname',
      body: 'my body',
      username: 'my username',
    };

    expect(thread).toStrictEqual({
      id: 'id-123',
      title: 'my fullname',
      body: 'my body',
      username: 'my username',
    });

    // @ts-expect-error: thread id should readonly
    thread.id = 'changed';
    // @ts-expect-error: thread title should readonly
    thread.title = 'changed';
    // @ts-expect-error: thread body should readonly
    thread.body = 'changed';
    // @ts-expect-error: thread username should readonly
    thread.username = 'changed';
  });

  it("should create ThreadEntity object with readonly properties", () => {
    const threadEntity: ThreadEntity = {
      id: 'id-123',
      title: 'my fullname',
      body: 'secret',
      username: 'my username',
      date: 'date'
    };

    expect(threadEntity).toStrictEqual({
      id: 'id-123',
      title: 'my fullname',
      body: 'secret',
      username: 'my username',
      date: 'date'
    });

    // @ts-expect-error: threadEntity id should readonly
    threadEntity.id = 'changed';
    // @ts-expect-error: threadEntity title should readonly
    threadEntity.title = 'changed';
    // @ts-expect-error: threadEntity body should readonly
    threadEntity.body = 'changed';
    // @ts-expect-error: threadEntity username should readonly
    threadEntity.username = 'changed';
    // @ts-expect-error: threadEntity date should readonly
    threadEntity.date = 'changed';
  });

  it("should create AddedThread object with readonly properties", () => {
    const addedThread: AddedThread = {
      id: 'id-123',
      title: 'my fullname',
      owner: 'my username',
    };

    expect(addedThread).toStrictEqual({
      id: 'id-123',
      title: 'my fullname',
      owner: 'my username',
    });

    // @ts-expect-error: addedThread id should readonly
    addedThread.id = 'changed';
    // @ts-expect-error: addedThread title should readonly
    addedThread.title = 'changed';
    // @ts-expect-error: addedThread owner should readonly
    addedThread.owner = 'changed';
  });

  it("should create ThreadDetailsEntity object with readonly properties and null comments", () => {
    const threadDetailsEntity: ThreadDetailsEntity = {
      id: 'id-123',
      title: 'my fullname',
      body: 'secret',
      username: 'my username',
      date: 'date',
      comments: null
    };

    expect(threadDetailsEntity).toStrictEqual({
      id: 'id-123',
      title: 'my fullname',
      body: 'secret',
      username: 'my username',
      date: 'date',
      comments: null
    });

    // @ts-expect-error: threadDetailsEntity id should readonly
    threadDetailsEntity.id = 'changed';
    // @ts-expect-error: threadDetailsEntity title should readonly
    threadDetailsEntity.title = 'changed';
    // @ts-expect-error: threadDetailsEntity body should readonly
    threadDetailsEntity.body = 'changed';
    // @ts-expect-error: threadDetailsEntity username should readonly
    threadDetailsEntity.username = 'changed';
    // @ts-expect-error: threadDetailsEntity date should readonly
    threadDetailsEntity.date = 'changed';
    // @ts-expect-error: threadDetailsEntity comments should readonly
    threadDetailsEntity.comments = [];
  });

  it("should create ThreadDetailsEntity object with readonly properties", () => {
    const threadDetailsEntity: ThreadDetailsEntity = {
      id: 'id-123',
      title: 'my fullname',
      body: 'secret',
      username: 'my username',
      date: 'date',
      comments: [{
        id: '1',
        content: 'content 1',
        date: expect.any(String),
        username: 'user-2',
        is_delete: false,
        thread_id: '1',
        replies: [{
          id: '2',
          content: 'content reply',
          date: expect.any(String),
          username: 'user-3',
          is_delete: true,
          thread_id: '1',
          comment_id: '1'
        }]
      }]
    };

    expect(threadDetailsEntity).toStrictEqual({
      id: 'id-123',
      title: 'my fullname',
      body: 'secret',
      username: 'my username',
      date: 'date',
      comments: [{
        id: '1',
        content: 'content 1',
        date: expect.any(String),
        username: 'user-2',
        is_delete: false,
        thread_id: '1',
        replies: [{
          id: '2',
          content: 'content reply',
          date: expect.any(String),
          username: 'user-3',
          is_delete: true,
          thread_id: '1',
          comment_id: '1'
        }]
      }]
    });

    // @ts-expect-error: threadDetailsEntity id should readonly
    threadDetailsEntity.id = 'changed';
    // @ts-expect-error: threadDetailsEntity title should readonly
    threadDetailsEntity.title = 'changed';
    // @ts-expect-error: threadDetailsEntity body should readonly
    threadDetailsEntity.body = 'changed';
    // @ts-expect-error: threadDetailsEntity username should readonly
    threadDetailsEntity.username = 'changed';
    // @ts-expect-error: threadDetailsEntity date should readonly
    threadDetailsEntity.date = 'changed';
    // @ts-expect-error: threadDetailsEntity comments should readonly
    threadDetailsEntity.comments = [];
  });

  it("should create ThreadPayload object with readonly properties", () => {
    const threadPayload: ThreadPayload = {
      title: 'my fullname',
      body: 'body'
    };

    expect(threadPayload).toStrictEqual({
      title: 'my fullname',
      body: 'body'
    });

    // @ts-expect-error: threadPayload title should readonly
    threadPayload.title = 'changed';
    // @ts-expect-error: threadPayload body should readonly
    threadPayload.body = 'changed';
  });

  it("should create AddThreadPayload object with readonly properties", () => {
    const addThreadPayload: AddThreadPayload = {
      title: 'my fullname',
      body: 'body',
      username: 'my username'
    };

    expect(addThreadPayload).toStrictEqual({
      title: 'my fullname',
      body: 'body',
      username: 'my username'
    });

    // @ts-expect-error: addThreadPayload title should readonly
    addThreadPayload.title = 'changed';
    // @ts-expect-error: addThreadPayload body should readonly
    addThreadPayload.body = 'changed';
    // @ts-expect-error: addThreadPayload username should readonly
    addThreadPayload.username = 'changed';
  });
});