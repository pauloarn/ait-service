import { messagesUtilKeys } from '@utils/messages.util'
import { HttpStatus } from '@nestjs/common'
import { AbstractException } from './abstract-exception'

export class ApiErrorException extends AbstractException {
  public status = HttpStatus.INTERNAL_SERVER_ERROR
  public readonly description: messagesUtilKeys
  public readonly body: unknown

  constructor(
    status: HttpStatus,
    description: messagesUtilKeys,
    body?: unknown
  ) {
    super(HttpStatus[status])
    this.status = status
    this.description = description
    this.body = body
  }
}
