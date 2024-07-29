import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { ValidationErrorException } from '@exceptions/validation-error.exception'

export const validateData = (validator: new () => any, data: any) => {
  const reportValidation = plainToInstance(validator, data)
  const errors = validateSync(reportValidation, {
    whitelist: true,
    forbidNonWhitelisted: true,
    validationError: {
      target: false,
      value: false
    }
  })
  if (errors.length) {
    throw new ValidationErrorException(errors)
  }
}
