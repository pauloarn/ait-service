import { HttpStatus } from '@nestjs/common'
import { messagesUtil, MessagesUtilKeys } from '@utils/messages.util'

export class Response<T> {
  private statusCode: number = 400
  private messageCode: string
  private message: string
  body: T

  public setStatusCode(
    httpStatus: HttpStatus,
    messageApiEnum: MessagesUtilKeys
  ): Response<T> {
    this.statusCode = httpStatus
    this.messageCode = messageApiEnum
    this.message = messagesUtil[messageApiEnum]
    return this
  }

  public setOk(): Response<T> {
    const messageApiEnum: MessagesUtilKeys = 'REQUEST_DONE'
    this.statusCode = 200
    this.messageCode = messageApiEnum
    this.message = messagesUtil[messageApiEnum]
    return this
  }

  public setData(data: T) {
    this.body = data
  }
}
