import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { LoggerAbstract } from '@logger/logger.abstract'
import { ContextService } from '@context/context.service'
import { differenceInMilliseconds } from 'date-fns'

@Injectable()
export class ConfigMiddleware implements NestMiddleware {
  constructor(
    private logger: LoggerAbstract,
    private ctx: ContextService
  ) {
    this.logger.setContext(ConfigMiddleware.name)
  }

  use(req: Request, res: Response, next: NextFunction) {
    res.locals.timeIni = new Date().getTime()
    this.ctx.setDataContext('req', {
      originalUrl: req.originalUrl,
      method: req.method,
      host: `${req.protocol}://${req.get('host')}`
    })

    this.logger.info('Iniciando requisição')
    this.logger.debug('body: {}', JSON.stringify(req.body))

    res.on('finish', () => {
      this.logger.info(
        `Tempo de execução: ${differenceInMilliseconds(
          new Date(),
          res.locals.timeIni
        )} ms`
      )
    })

    next()
  }
}
