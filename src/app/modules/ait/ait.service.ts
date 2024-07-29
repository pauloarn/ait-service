import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { NewAitDTO, NewAitInterface } from '@modules/ait/dto/request/NewAit.dto'
import { validateData } from '@utils/validation.utils'
import { ApiErrorException } from '@exceptions/api-error.exception'
import { AitStatus } from '@typings/ati_status.typing'
import { Ait } from '@entities/ati/ait.entity'
import { AitHistoryService } from '@modules/ait_history/ait_history.service'
import { returnDateFromStringFormated } from '@utils/date.utils'
import { AitSimpleDTO } from '@modules/ait/dto/response/AitSimple.dto'
import { AitMessageService } from '../../message/ait/ait_message.service'
import {
  IPaginationOptions,
  paginate,
  Pagination
} from 'nestjs-typeorm-paginate'
import { Transactional } from 'typeorm-transactional'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'

@Injectable()
export class AitService {
  constructor(
    @Inject('AIT_REPOSITORY')
    private aitRepository: Repository<Ait>,
    private aitHistoryService: AitHistoryService,
    private aitMessageService: AitMessageService
  ) {}

  async findAll(paginateData: IPaginationOptions): Promise<Pagination<Ait>> {
    console.log(this.aitRepository)
    const queryBuilder: SelectQueryBuilder<Ait> =
      this.aitRepository.createQueryBuilder('a')
    console.log(queryBuilder)
    queryBuilder.orderBy('a.date', 'ASC') // Or whatever you need to do

    return paginate<Ait>(queryBuilder, paginateData)
  }

  @Transactional()
  async createAit(aitData: NewAitInterface): Promise<AitSimpleDTO> {
    const ait = this.newAtiDtoToAit(aitData)
    const createdAit = await this.aitRepository.save(ait)
    await this.aitMessageService.emmitCreatedAit(ait)
    return new AitSimpleDTO().fromAit(createdAit)
  }

  @Transactional()
  async requestCancelAit(aitId: string, reason: string): Promise<AitSimpleDTO> {
    const aitRequestedToCancel = await this.aitRepository.findOne({
      where: { id: aitId }
    })
    const nextStatus = AitStatus.SOLICITADO_CANCELAMENTO
    const ait = this.validateAitStatusMovement(
      aitRequestedToCancel,
      nextStatus,
      reason
    )
    ait.status = AitStatus.SOLICITADO_CANCELAMENTO
    await this.aitHistoryService.createAitHistory(ait, nextStatus, reason)
    const updatedAit = await this.aitRepository.save(ait)

    return new AitSimpleDTO().fromAit(updatedAit)
  }

  @Transactional()
  async confirmCancelAit(aitId: string, reason: string) {
    const aitToCancel = await this.aitRepository.findOne({
      where: { id: aitId }
    })
    const ait = this.validateAitStatusMovement(
      aitToCancel,
      AitStatus.CANCELADO,
      reason
    )
    ait.status = AitStatus.CANCELADO
    await this.aitHistoryService.createAitHistory(
      ait,
      AitStatus.CANCELADO,
      reason
    )
    const updatedAit = await this.aitRepository.save(ait)

    return new AitSimpleDTO().fromAit(updatedAit)
  }

  private validateAitStatusMovement(
    currentAit: Ait | null,
    aitNewStatus: AitStatus,
    reason: string
  ) {
    if (!reason || !reason.length) {
      throw new ApiErrorException(HttpStatus.BAD_REQUEST, 'NEED_REASON')
    }
    if (!currentAit) {
      throw new ApiErrorException(HttpStatus.BAD_REQUEST, 'AIT_NOT_FOUND')
    }

    switch (currentAit.status) {
      case AitStatus.EM_ANDAMENTO:
        if (aitNewStatus !== AitStatus.SOLICITADO_CANCELAMENTO) {
          throw new ApiErrorException(
            HttpStatus.BAD_REQUEST,
            'AIT_NOT_ON_GOING'
          )
        }
        break
      case AitStatus.SOLICITADO_CANCELAMENTO:
        this.validateAitCancelRequest(aitNewStatus)
        break
      case AitStatus.CANCELADO:
        throw new ApiErrorException(
          HttpStatus.BAD_REQUEST,
          'AIT_ALREADY_CANCELED'
        )
    }
    return currentAit
  }

  private newAtiDtoToAit(aitData: NewAitInterface): Ait {
    try {
      validateData(NewAitDTO, aitData)
      const ati = new Ait()
      ati.atiName = aitData.nome
      ati.conductorName = aitData.nomeCondutor
      ati.date = returnDateFromStringFormated(aitData.data)
      ati.agentName = aitData.nomeAgente
      return ati
    } catch (e: any) {
      throw new ApiErrorException(
        HttpStatus.BAD_REQUEST,
        'VALIDATION_ERRO',
        e.message
      )
    }
  }

  private validateAitCancelRequest(aitStatus: AitStatus) {
    if (aitStatus === AitStatus.SOLICITADO_CANCELAMENTO) {
      throw new ApiErrorException(
        HttpStatus.BAD_REQUEST,
        'AIT_ALREADY_REQUESTED_TO_CANCEL'
      )
    }
    if (aitStatus !== AitStatus.CANCELADO) {
      throw new ApiErrorException(
        HttpStatus.BAD_REQUEST,
        'AIT_NOT_REQUESTED_TO_CANCEL'
      )
    }
  }
}
