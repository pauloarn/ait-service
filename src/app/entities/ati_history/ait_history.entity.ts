import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AitStatus } from '@typings/ati_status.typing'
import { Ait } from '../ati/ait.entity'

@Entity()
export class AitHitory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: AitStatus, nullable: false })
  movement: AitStatus

  @Column({ nullable: false, type: 'varchar' })
  reason: string

  @ManyToOne(() => Ait, (ait) => ait.aitHistory)
  ait: Ait
}
