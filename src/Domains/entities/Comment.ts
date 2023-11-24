export type Comment = {
  readonly id: string,
  readonly thread_id:string,
  readonly username: string,
  readonly content: string,
}

export type CommentEntity = {
  readonly id: string,
  readonly thread_id:string,
  readonly username: string,
  readonly content: string,
  readonly date: Date,
}

export type AddedComment = Omit<Comment, 'username' | 'thread_id'> & { owner: string }
export type DeletedComment = Pick<Comment, 'content'>
export type CommentPayload = Pick<Comment, 'content'>
export type CommentUseCasePayload = Omit<Comment, 'id'>