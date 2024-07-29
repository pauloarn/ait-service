import { DataType, newDb } from 'pg-mem'
import { Ait } from '@entities/ati/ait.entity'
import { AitHitory } from '@entities/ati_history/ait_history.entity'
import { TypeOrmDataSourceFactory } from '@nestjs/typeorm'
import { v4 } from 'uuid'

export const instanciateNewInMemoryDb = async () => {
  const db = newDb({
    autoCreateForeignKeyIndices: true
  })
  db.public.registerFunction({
    name: 'obj_description',
    args: [DataType.text, DataType.text],
    returns: DataType.text,
    implementation: () => 'obj'
  })
  db.public.registerFunction({
    implementation: () => 'AitDataBase',
    name: 'current_database'
  })

  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: v4,
      impure: true
    })
  })

  db.public.registerFunction({
    name: 'version',
    args: [],
    returns: DataType.text,
    implementation: () => `1.0`
  })
  const dataSource = (await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [Ait, AitHitory],
    synchronize: true
  })) as TypeOrmDataSourceFactory

  //@ts-ignore
  await dataSource.initialize()
  return dataSource
}
