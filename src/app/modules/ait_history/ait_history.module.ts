import { Module } from '@nestjs/common'
import { DatabaseModule } from '@database/database.module'
import { AitHistoryService } from '@modules/ait_history/ait_history.service'
import { aitHistoryProviders } from '@entities/ati_history/ait_history.provider'

@Module({
  imports: [DatabaseModule],
  providers: [...aitHistoryProviders, AitHistoryService],
  exports: [AitHistoryService]
})
export class AitHistoryModule {}
