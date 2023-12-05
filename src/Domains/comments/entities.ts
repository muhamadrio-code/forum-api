export type Comment = {
  readonly id: string,
  readonly thread_id:string,
  readonly username: string,
  readonly content: string,
}

export type CommentEntity = Comment & {
  readonly is_delete: boolean,
  readonly date: string
}

export type AddedComment = Pick<Comment, 'id' | 'content'> & { readonly owner: string }
export type DeletedComment = Pick<Comment, 'content'>
export type CommentPayload = Pick<Comment, 'content'>
export type CommentUseCasePayload = Omit<Comment, 'id'>