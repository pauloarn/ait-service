import { DataSource } from 'typeorm'
import { Ait } from './ait.entity'

export const aitProviders = [
  {
    provide: 'AIT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Ait),
    inject: ['DATA_SOURCE']
  }
]
