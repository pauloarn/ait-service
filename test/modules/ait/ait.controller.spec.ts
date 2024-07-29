import { Test } from '@nestjs/testing'
import { AppModule } from '../../../src/app.module'
import request from 'supertest'
import TestAgent from 'supertest/lib/agent'
import {
  createAitBodyRequest,
  reasonConfirmCancelAit,
  reasonRequestCancelAit
} from './expectObjects'
import { AitMessageService } from '../../../src/app/message/ait/ait_message.service'
import { Ait } from '@entities/ati/ait.entity'
import { Repository } from 'typeorm'
import { initializeTransactionalContext } from 'typeorm-transactional'
import { instanciateNewInMemoryDb } from '../../utils/db-test.utils'
import { AitStatus } from '@typings/ati_status.typing'

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  runOnTransactionCommit: () => () => ({}),
  runOnTransactionRollback: () => () => ({}),
  runOnTransactionComplete: () => () => ({}),
  initializeTransactionalContext: () => ({}) // seems to be required for testing
}))

describe('AitController', () => {
  let api: TestAgent
  let aitRepository: Repository<Ait>

  beforeAll(async () => {
    initializeTransactionalContext()
    const dataSource = instanciateNewInMemoryDb()
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider('DATA_SOURCE')
      .useValue(dataSource)
      .compile()

    const app = moduleRef.createNestApplication()
    await app.init()
    api = request(app.getHttpServer())

    aitRepository = app.get<Repository<Ait>>('AIT_REPOSITORY')
    const messageServiceMock = jest.spyOn(
      AitMessageService.prototype,
      'emmitCreatedAit'
    )
    messageServiceMock.mockImplementation(async () => {})
  })

  describe('should create and list AITs paginated', () => {
    let firstAitCreatd: Ait
    it('should create new AIT', async () => {
      const res = await api
        .post('/ait/create')
        .send(createAitBodyRequest)
        .expect(201)
      expect(res.body.body.nomeCondutor).toBe(createAitBodyRequest.nomeCondutor)
      firstAitCreatd = res.body.body
    })
    it('should return AIT paginated', async () => {
      const res = await api.get('/ait').expect(200)
      expect(res.body.body.items[0]).toStrictEqual(firstAitCreatd)
    })

    it('should request to cancel AIT', async () => {
      const res = await api
        .put(`/ait/request-cancel/${firstAitCreatd.id}`)
        .send(reasonRequestCancelAit)
        .expect(200)
      expect(res.body.body.status).toBe(AitStatus.SOLICITADO_CANCELAMENTO)
    })

    it('should request cancel AIT', async () => {
      const res = await api
        .put(`/ait/confirm-ait-cancel/${firstAitCreatd.id}`)
        .send(reasonConfirmCancelAit)
        .expect(200)
      expect(res.body.body.status).toBe(AitStatus.CANCELADO)
    })

    it('should list canceled AIT', async () => {
      const res = await api.get('/ait').expect(200).expect(200)
      const canceledAit = { ...firstAitCreatd, status: AitStatus.CANCELADO }
      expect(res.body.body.items[0]).toStrictEqual(canceledAit)
    })
  })
})
