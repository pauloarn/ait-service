import { ClientsModule, Transport } from '@nestjs/microservices'

export const MessageClientModule = ClientsModule.register([
  {
    name: 'MESSAGE_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://admin:admin1234@localhost:5672`],
      queue: 'ait_creation_queue',
      queueOptions: {
        durable: true
      }
    }
  }
])
