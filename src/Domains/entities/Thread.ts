export type Thread = {
  readonly id: string,
  readonly title: string,
  readonly body: string,
  readonly username: string,
}

export type ThreadEntity = Thread & { readonly date: string }

export type ThreadDetails = {
  readonly id: string,
  readonly title: string,
  readonly body: string,
  readonly date: string,
  readonly username: string,
  readonly comments: ThreadComment[]
}

export type ThreadSimple = Pick<Thread, 'id' | 'title' | 'username'>
export type ThreadPayload = Pick<Thread, 'title' | 'body'>
export type AddThreadPayload = ThreadPayload & Pick<Thread, 'username'>
export type ThreadComment = {
  readonly id: string,
  readonly username: string,
  readonly content: string,
  readonly date: string
}