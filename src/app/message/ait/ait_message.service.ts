import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Ait } from '@entities/ati/ait.entity'

@Injectable()
export class AitMessageService {
  constructor(
    @Inject('MESSAGE_SERVICE')
    private readonly messageClient: ClientProxy
  ) {}

  async emmitCreatedAit(ait: Ait) {
    const res = this.messageClient.emit('created_ait', JSON.stringify(ait))
    res.subscribe()
  }
}
