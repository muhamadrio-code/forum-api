export type Comment = {
  readonly id: string,
  readonly thread_id:string,
  readonly username: string,
  readonly content: string,
  readonly is_delete?: boolean,
  readonly reply_to?: string | null,
}

export type CommentEntity = Omit<Comment, 'reply_to'> & { readonly date: string }

export type CommentWithReplies = CommentEntity & { readonly replies: CommentEntity[] }

export type AddedComment = Pick<Comment, 'id' | 'content'> & { readonly owner: string }
export type DeletedComment = Pick<Comment, 'content'>
export type CommentPayload = Pick<Comment, 'content'>
export type CommentUseCasePayload = Omit<Comment, 'id'>