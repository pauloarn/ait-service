import { Module } from '@nestjs/common'
import { AitService } from './ait.service'
import { AitController } from '@modules/ait/ait.controller'
import { DatabaseModule } from '@database/database.module'
import { aitProviders } from '@entities/ati/ait.provider'
import { AitHistoryModule } from '@modules/ait_history/ait_history.module'
import { AitMessageModule } from '../../message/ait/ait_message.module'

@Module({
  imports: [DatabaseModule, AitHistoryModule, AitMessageModule],
  controllers: [AitController],
  providers: [...aitProviders, AitService]
})
export class AitModule {}
