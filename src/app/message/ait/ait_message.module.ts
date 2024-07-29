import { Module } from '@nestjs/common'
import { AitMessageService } from './ait_message.service'
import { MessageClientModule } from '../message_client.module'

@Module({
  imports: [MessageClientModule],
  providers: [AitMessageService],
  exports: [AitMessageService]
})
export class AitMessageModule {}
