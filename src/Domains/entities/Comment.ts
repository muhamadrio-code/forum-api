export type Comment = {
  readonly id: string,
  readonly threadId:string,
  readonly username: string,
  readonly content: string,
  readonly isDelete?: boolean,
  readonly replyTo?: string | null,
}

export type CommentEntity = {
  readonly id: string,
  readonly thread_id:string,
  readonly username: string,
  readonly content: string,
  readonly date: Date,
  readonly is_delete?: boolean,
  readonly reply_to?: string | null,
}

export type AddedComment = Pick<Comment, 'id' | 'content'> & { owner: string }
export type DeletedComment = Pick<Comment, 'content'>
export type CommentPayload = Pick<Comment, 'content'>
export type CommentUseCasePayload = Omit<Comment, 'id'>