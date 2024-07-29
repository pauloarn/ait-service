import { AbstractException } from './abstract-exception'
import { ValidationError } from '@nestjs/common'
import { Null } from '@typings/generic.typing'

export class ValidationErrorException extends AbstractException {
  public erros: ValidationError[]
  public arrayIndex: Null<number> = null

  constructor(errors: ValidationError[], arrayIndex?: number) {
    super('validationError')
    this.erros = errors
    this.arrayIndex = arrayIndex ?? null
  }
}
