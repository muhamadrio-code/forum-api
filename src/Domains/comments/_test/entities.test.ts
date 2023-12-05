import {
  AddedComment,
  Comment,
  CommentEntity,
  CommentPayload,
  CommentUseCasePayload,
  CommentWithReplies,
  DeletedComment
} from "../entities";

describe("comments entities", () => {
  it("should create Comment object with readonly properties", () => {
    const comment: Comment = {
      id: 'id-123',
      username: 'my username',
      content: 'content',
      thread_id: '1',
    };

    expect(comment).toStrictEqual({
      id: 'id-123',
      username: 'my username',
      content: 'content',
      thread_id: '1',
    });

    // @ts-expect-error: comment id should readonly
    comment.id = 'changed';
    // @ts-expect-error: comment username should readonly
    comment.username = 'changed';
    // @ts-expect-error: comment content should readonly
    comment.content = 'changed';
    // @ts-expect-error: comment thread_id should readonly
    comment.thread_id = 'changed';
  });

  it("should create CommentWithReplies object with readonly properties", () => {
    const commentWithReplies: CommentWithReplies = {
      id: '1',
      username: 'my username',
      content: 'content',
      thread_id: '1',
      is_delete: false,
      date: 'date',
      replies: [{
        id: 'id-123',
        username: 'my username',
        content: 'content',
        thread_id: '1',
        is_delete: false,
        date: 'date',
        comment_id:'1'
      }]
    };

    expect(commentWithReplies).toStrictEqual({
      id: '1',
      username: 'my username',
      content: 'content',
      thread_id: '1',
      is_delete: false,
      date: 'date',
      replies: [{
        id: 'id-123',
        username: 'my username',
        content: 'content',
        thread_id: '1',
        is_delete: false,
        date: 'date',
        comment_id:'1'
      }]
    });

    // @ts-expect-error: commentWithReplies id should readonly
    commentWithReplies.id = 'changed';
    // @ts-expect-error: commentWithReplies username should readonly
    commentWithReplies.username = 'changed';
    // @ts-expect-error: commentWithReplies content should readonly
    commentWithReplies.content = 'changed';
    // @ts-expect-error: commentWithReplies thread_id should readonly
    commentWithReplies.thread_id = 'changed';
    // @ts-expect-error: commentWithReplies is_delete should readonly
    commentWithReplies.is_delete = true;
    // @ts-expect-error: commentWithReplies date should readonly
    commentWithReplies.date = 'changed';
    // @ts-expect-error: commentWithReplies replies should readonly
    commentWithReplies.replies = [];
  });

  it("should create CommentEntity object with readonly properties", () => {
    const commentEntity: CommentEntity = {
      id: 'id-123',
      username: 'my username',
      content: 'content',
      thread_id: '1',
      is_delete: false,
      date: 'date'
    };

    expect(commentEntity).toStrictEqual({
      id: 'id-123',
      username: 'my username',
      content: 'content',
      thread_id: '1',
      is_delete: false,
      date: 'date'
    });

    // @ts-expect-error: commentEntity id should readonly
    commentEntity.id = 'changed';
    // @ts-expect-error: commentEntity username should readonly
    commentEntity.username = 'changed';
    // @ts-expect-error: commentEntity content should readonly
    commentEntity.content = 'changed';
    // @ts-expect-error: commentEntity thread_id should readonly
    commentEntity.thread_id = 'changed';
    // @ts-expect-error: commentEntity is_delete should readonly
    commentEntity.is_delete = true;
    // @ts-expect-error: commentEntity date should readonly
    commentEntity.date = 'changed';
  });

  it("should create AddedComment object with readonly properties", () => {
    const addedComment: AddedComment = {
      id: 'id-123',
      content: 'content',
      owner: 'owner'
    };

    expect(addedComment).toStrictEqual({
      id: 'id-123',
      content: 'content',
      owner: 'owner'
    });

    // @ts-expect-error: commentWithReplies id should readonly
    addedComment.id = 'changed';
    // @ts-expect-error: commentWithReplies content should readonly
    addedComment.content = 'changed';
    // @ts-expect-error: commentWithReplies owner should readonly
    addedComment.owner = 'changed';
  });

  it("should create DeletedComment object with readonly properties", () => {
    const deletedComment: DeletedComment = {
      content: 'content',
    };

    expect(deletedComment).toStrictEqual({
      content: 'content',
    });

    // @ts-expect-error: commentWithReplies content should readonly
    deletedComment.content = 'changed';
  });

  it("should create CommentPayload object with readonly properties", () => {
    const commentPayload: CommentPayload = {
      content: 'content',
    };

    expect(commentPayload).toStrictEqual({
      content: 'content',
    });

    // @ts-expect-error: commentWithReplies content should readonly
    commentPayload.content = 'changed';
  });

  it("should create CommentUseCasePayload object with readonly properties", () => {
    const commentUseCasePayload: CommentUseCasePayload = {
      content: 'content',
      thread_id: '1',
      username: 'username',
    };

    expect(commentUseCasePayload).toStrictEqual({
      content: 'content',
      thread_id: '1',
      username: 'username',
    });

    // @ts-expect-error: commentUseCasePayload content should readonly
    commentUseCasePayload.content = 'changed';
    // @ts-expect-error: commentUseCasePayload id should readonly
    commentUseCasePayload.thread_id = 'changed';
    // @ts-expect-error: commentUseCasePayload username should readonly
    commentUseCasePayload.username = 'changed';
  });
});