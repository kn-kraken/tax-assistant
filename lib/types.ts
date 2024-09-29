export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
    name: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
}

export type Ok<T> = { type: 'ok'; data: T }

export type Error = { type: 'error'; message: string }

export type Result<T> = Ok<T> | Error

export type Author = 'user' | 'bot'

export interface MessageText {
  type: 'text'
  content: string
  timestamp: Date
  author: Author
}

export interface MessageFile {
  type: 'file'
  content: Buffer
  timestamp: Date
  author: Author
}

export type Message = MessageText | MessageFile

export type Chat = {
  userId: string
  id: string
  name: string
  messages: Message[]
}
