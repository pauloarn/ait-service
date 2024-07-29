import { DataSource, DataSourceOptions } from 'typeorm'
import { Provider } from '@nestjs/common'
import { addTransactionalDataSource } from 'typeorm-transactional'

const dsOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'aureaStrong@123',
  database: 'AitDataBase',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true
}

export const databaseProvider: Provider[] = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource(dsOptions)
      // dataSource.initialize()
      const dataSourceWithTransactions = addTransactionalDataSource(
        await dataSource.initialize()
      )
      return dataSourceWithTransactions
    }
  }
]
