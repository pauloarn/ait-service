import { Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { AitHitory } from '@entities/ati_history/ait_history.entity'
import { Ait } from '@entities/ati/ait.entity'
import { AitStatus } from '@typings/ati_status.typing'

@Injectable()
export class AitHistoryService {
  constructor(
    @Inject('AIT_HISTORY_REPOSITORY')
    private repository: Repository<AitHitory>
  ) {}

  async createAitHistory(ait: Ait, newStatus: AitStatus, reason: string) {
    const aitHistory = new AitHitory()
    aitHistory.ait = ait
    aitHistory.movement = newStatus
    aitHistory.reason = reason
    return await this.repository.save(aitHistory)
  }
}
