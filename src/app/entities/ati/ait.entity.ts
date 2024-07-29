import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { AitStatus } from '@typings/ati_status.typing'
import { AitHitory } from '../ati_history/ait_history.entity'

@Entity()
export class Ait {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: false })
  atiName: string

  @Column({ type: 'timestamp', nullable: false })
  date: Date

  @Column({ type: 'varchar', nullable: false })
  agentName: string

  @Column({ type: 'varchar', nullable: false })
  conductorName: string

  @Column({ type: 'enum', enum: AitStatus, default: AitStatus.EM_ANDAMENTO })
  status: AitStatus

  @OneToMany(() => AitHitory, (aitHistory) => aitHistory.ait)
  aitHistory: AitHitory[]
}
