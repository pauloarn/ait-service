import { MiddlewareConsumer, Module, Scope } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from '@logger/logger.module'
import { APP_FILTER } from '@nestjs/core'
import { systemConfig } from '@config/system.config'
import helmet from 'helmet'
import { AllExceptionsFilter } from '@exceptions/all.exception'
import { ContextModule } from '@contexts/context.module'
import { ConfigMiddleware } from '@middlewares/config.middleware'
import { AitModule } from '@modules/ait/ait.module'
import { AitHistoryModule } from '@modules/ait_history/ait_history.module'
import { MessageClientModule } from './app/message/message_client.module'
import { AitMessageModule } from './app/message/ait/ait_message.module'

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
    MessageClientModule,
    ContextModule,
    LoggerModule,
    AitModule,
    AitHistoryModule,
    AitMessageModule
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet(), ConfigMiddleware).forRoutes('*')
  }
}
