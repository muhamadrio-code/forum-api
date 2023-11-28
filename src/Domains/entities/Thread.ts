import { CommentEntity } from "./Comment";

export type Thread = {
  readonly id: string,
  readonly title: string,
  readonly body: string,
  readonly username: string,
}

export type ThreadEntity = Thread & { readonly date: string }
export type AddedThread = Omit<Thread, 'username' | 'body'> & { owner: string }

export type ThreadDetailsEntity = {
  readonly id: string,
  readonly title: string,
  readonly body: string,
  readonly date: string,
  readonly username: string,
  readonly comments: CommentEntity[]
}

export type ThreadPayload = Pick<Thread, 'title' | 'body'>
export type AddThreadPayload = ThreadPayload & Pick<Thread, 'username'>
