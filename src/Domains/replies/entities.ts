export type CommentReply = {
  readonly id: string,
  readonly comment_id: string,
  readonly thread_id:string,
  readonly username: string,
  readonly content: string,
}

export type CommentReplyEntity = CommentReply & {
  readonly date: string,
  readonly is_delete: boolean,
}

export type AddedReply = Pick<CommentReply, 'id' | 'content'> & { readonly owner: string }
export type AddReplyUseCasePayload = Omit<CommentReply, 'id'>