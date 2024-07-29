import { Ait } from '@entities/ati/ait.entity'
import { getDateStringFromDateObject } from '@utils/date.utils'

export class AitSimpleDTO {
  private id: string
  private nomeAti: string
  private nomeCondutor: string
  private nomeAgente: string
  private data: string
  private status: string

  fromAit(ait: Ait): this {
    this.id = ait.id
    this.data = getDateStringFromDateObject(ait.date)
    this.nomeAti = ait.atiName
    this.nomeAgente = ait.agentName
    this.nomeCondutor = ait.conductorName
    this.status = ait.status
    return this
  }
}
