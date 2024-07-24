import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WinstonLoggerService } from '@logger/winston-logger.service'
import { ConfigService } from '@nestjs/config'
import express from 'express'
import { SystemConfig } from '@config/system.config'
import { ValidationErrorException } from './app/exception/validation-error.exception'
import { ValidationPipe } from '@nestjs/common'
import { ContextUtil } from '@utils/context.util'

async function bootstrap() {
  const logger = new WinstonLoggerService()
  const app = await NestFactory.create(AppModule, {
    logger
  })
  const configService: ConfigService<SystemConfig, true> =
    app.get(ConfigService)

  app.setGlobalPrefix(configService.get('globalPrefix'))
  app.enableCors(configService.get('corsConfig'))
  app.use(express.json({ limit: '50mb' }))
  app.use(ContextUtil.middleware)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validationError: {
        target: false,
        value: false
      },
      exceptionFactory: (errors) => new ValidationErrorException(errors)
    })
  )

  const port: number = configService.get('port')

  await app.listen(port, () => {
    logger.log(`Server initialized in port: ${port}`)
  })
}

bootstrap().then()
