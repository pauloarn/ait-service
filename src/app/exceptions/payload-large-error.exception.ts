import { AbstractException } from './abstract-exception'

export class PayloadTooLargeError extends AbstractException {
  public readonly description: string

  constructor(description: string) {
    super(description)
    this.description = description
  }
}
