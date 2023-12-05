import { AddReplyUseCasePayload, AddedReply, CommentReply, CommentReplyEntity } from "../entities";

describe("comments entities", () => {
  it("should create CommentReply object with readonly properties", () => {
    const commentReply: CommentReply = {
      id: 'id-123',
      username: 'my username',
      content: 'content',
      thread_id: '1',
      comment_id: '2'
    };

    expect(commentReply).toStrictEqual({
      id: 'id-123',
      username: 'my username',
      content: 'content',
      thread_id: '1',
      comment_id: '2'
    });

    // @ts-expect-error: commentReply id should readonly
    commentReply.id = 'changed';
    // @ts-expect-error: commentReply username should readonly
    commentReply.username = 'changed';
    // @ts-expect-error: commentReply content should readonly
    commentReply.content = 'changed';
    // @ts-expect-error: commentReply thread_id should readonly
    commentReply.thread_id = 'changed';
    // @ts-expect-error: commentReply comment_id should readonly
    commentReply.comment_id = 'changed';
  });

  it("should create CommentReplyEntity object with readonly properties", () => {
    const commentReplyEntity: CommentReplyEntity = {
      id: 'id-123',
      username: 'my username',
      content: 'content',
      thread_id: '1',
      comment_id: '2',
      date: 'date',
      is_delete: false
    };

    expect(commentReplyEntity).toStrictEqual({
      id: 'id-123',
      username: 'my username',
      content: 'content',
      thread_id: '1',
      comment_id: '2',
      date: 'date',
      is_delete: false
    });

    // @ts-expect-error: commentReplyEntity id should readonly
    commentReplyEntity.id = 'changed';
    // @ts-expect-error: commentReplyEntity username should readonly
    commentReplyEntity.username = 'changed';
    // @ts-expect-error: commentReplyEntity content should readonly
    commentReplyEntity.content = 'changed';
    // @ts-expect-error: commentReplyEntity thread_id should readonly
    commentReplyEntity.thread_id = 'changed';
    // @ts-expect-error: commentReplyEntity comment_id should readonly
    commentReplyEntity.comment_id = 'changed';
    // @ts-expect-error: commentReplyEntity is_delete should readonly
    commentReplyEntity.is_delete = true;
    // @ts-expect-error: commentReplyEntity date should readonly
    commentReplyEntity.date = 'changed';
  });

  it("should create AddedReply object with readonly properties", () => {
    const addedReply: AddedReply = {
      id: 'id-123',
      content: 'content',
      owner: 'owner'
    };

    expect(addedReply).toStrictEqual({
      id: 'id-123',
      content: 'content',
      owner: 'owner'
    });

    // @ts-expect-error: addedReply id should readonly
    addedReply.id = 'changed';
    // @ts-expect-error: addedReply owner should readonly
    addedReply.owner = 'changed';
    // @ts-expect-error: addedReply content should readonly
    addedReply.content = 'changed';
  });

  it("should create AddReplyUseCasePayload object with readonly properties", () => {
    const payload: AddReplyUseCasePayload = {
      username: 'my username',
      content: 'content',
      thread_id: '1',
      comment_id: '1',
    };

    expect(payload).toStrictEqual({
      username: 'my username',
      content: 'content',
      thread_id: '1',
      comment_id: '1',
    });

    // @ts-expect-error: payload username should readonly
    payload.username = 'changed';
    // @ts-expect-error: payload content should readonly
    payload.content = 'changed';
    // @ts-expect-error: payload thread_id should readonly
    payload.thread_id = 'changed';
    // @ts-expect-error: payload comment_id should readonly
    payload.comment_id = 'changed';
  });

});