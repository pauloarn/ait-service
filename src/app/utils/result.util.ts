import { Response as Res } from 'express'
import { messagesUtil, messagesUtilKeys } from './messages.util'
import { HttpStatus } from '@nestjs/common'
import { Undefined } from '../../typings/generic.typing'

export class ResponseApi<T> {
  private status = HttpStatus.OK
  private response: Res
  private code: messagesUtilKeys = 'requestDone'
  private data: Undefined<T> = undefined

  constructor(res: Res) {
    this.response = res
  }

  setOk(code: messagesUtilKeys = 'requestDone') {
    this.status = HttpStatus.OK
    this.code = code
    return this
  }

  setStatus(status: HttpStatus) {
    this.status = status
    return this
  }

  setCode(code: messagesUtilKeys) {
    this.code = code
    return this
  }

  setBody(data: T) {
    this.data = data
    return this
  }

  send() {
    const response = this.buildResponse()
    return this.response.status(this.status).send(response)
  }

  private buildResponse() {
    return {
      status: `${this.status} - ${HttpStatus[this.status]}`,
      code: this.code,
      msg: messagesUtil[this.code],
      body: this.data
    }
  }
}
