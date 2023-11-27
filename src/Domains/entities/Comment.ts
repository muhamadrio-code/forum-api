export type Comment = {
  readonly id: string,
  readonly threadId:string,
  readonly username: string,
  readonly content: string,
  readonly is_delete?: boolean,
  readonly replyTo?: string,
}

export type CommentEntity = {
  readonly id: string,
  readonly thread_id:string,
  readonly username: string,
  readonly content: string,
  readonly date: Date,
}

export type AddedComment = Pick<Comment, 'id' | 'content'> & { owner: string }
export type DeletedComment = Pick<Comment, 'content'>
export type CommentPayload = Pick<Comment, 'content'>
export type CommentUseCasePayload = Omit<Comment, 'id'>