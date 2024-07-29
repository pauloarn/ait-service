import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  NotFoundException
} from '@nestjs/common'
import { Response } from 'express'
import { BaseExceptionFilter } from '@nestjs/core'
import { messagesUtil } from '@utils/messages.util'
import { LoggerAbstract } from '@logger/logger.abstract'
import { Null } from '@typings/generic.typing'
import { ApiErrorException } from './api-error.exception'
import { ValidationErrorException } from './validation-error.exception'
import { PayloadTooLargeError } from './payload-large-error.exception'
import { ResponseApi } from '@utils/result.util'

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private response: Null<Response> = null

  constructor(private logger: LoggerAbstract) {
    super()
    logger.setContext(AllExceptionsFilter.name)
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    this.response = response

    this.logger.error(exception.name)
    this.logger.error(exception.stack)

    const exceptionList: Record<string, (ex: any) => void> = {
      ApiErrorException: this.apiErrorException,
      NotFoundException: this.notFoundException,
      ValidationErrorException: this.classValidationException,
      PayloadTooLargeError: this.payloadException
    }

    const execFuncException = exceptionList[exception.name] ?? null
    if (execFuncException) {
      return execFuncException.bind(this)(exception)
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    return this.buildResponse()
      .setStatus(status)
      .setCode('UNKNOWN_ERROR')
      .setBody({ path: request.url })
      .send()
  }

  private apiErrorException(exception: ApiErrorException) {
    this.logger.error(
      `${exception.description} - {}`,
      messagesUtil[exception.description]
    )
    const response = this.buildResponse()
    return response
      .setStatus(exception.status)
      .setCode(exception.description)
      .setBody(exception.body)
      .send()
  }

  private notFoundException(exception: NotFoundException) {
    const response = this.buildResponse()
    return response
      .setStatus(HttpStatus.NOT_FOUND)
      .setCode('ROUTE_NOT_FOUND')
      .setBody(exception.message)
      .send()
  }

  private classValidationException(exception: ValidationErrorException) {
    const response = this.buildResponse()
    this.logger.error(exception.erros)

    let body: any = exception.erros
    if (exception.arrayIndex != null) {
      body = {
        arrayIndex: exception.arrayIndex,
        error: exception.erros
      }
    }

    return response
      .setStatus(HttpStatus.BAD_REQUEST)
      .setCode('VALIDATION_ERRO')
      .setBody(body)
      .send()
  }

  private payloadException(exception: PayloadTooLargeError) {
    const response = this.buildResponse()
    return response
      .setStatus(HttpStatus.PAYLOAD_TOO_LARGE)
      .setCode('PAYLOAD_TOO_LARGE')
      .setBody(exception.message)
      .send()
  }

  private getResponse() {
    if (this.response) {
      return this.response
    }
    throw new Error('Sem response')
  }

  private buildResponse() {
    return new ResponseApi(this.getResponse())
  }
}
