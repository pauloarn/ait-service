import { MiddlewareConsumer, Module, Scope } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from '@logger/logger.module'
import { APP_FILTER } from '@nestjs/core'
import { systemConfig } from '@config/system.config'
import helmet from 'helmet'
import { AllExceptionsFilter } from './app/exception/all.exception'
import { ContextModule } from '@context/context.module'
import { ConfigMiddleware } from '@middlewares/config.middleware'

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
      scope: Scope.DEFAULT
    }
  ],
  imports: [
    ConfigModule.forRoot({
      load: [systemConfig]
    }),
    ContextModule,
    LoggerModule
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet(), ConfigMiddleware).forRoutes('*')
  }
}
