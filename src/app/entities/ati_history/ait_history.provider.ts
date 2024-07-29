import { DataSource } from 'typeorm'
import { AitHitory } from '@entities/ati_history/ait_history.entity'

export const aitHistoryProviders = [
  {
    provide: 'AIT_HISTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AitHitory),
    inject: ['DATA_SOURCE']
  }
]
