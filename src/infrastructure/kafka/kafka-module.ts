import { ConfigService } from '@nestjs/config';
import { KafkaService } from './kafka-service';
import { Module } from '@nestjs/common';
import { IKafkaConfig } from './kafka-client-interface';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {
  static register(config: IKafkaConfig) {
    const { name, groupId, clientId } = config;
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: configService.get<string>(`${clientId}`),
                  brokers: [configService.get<string>('KAFKABROKER')],
                },
                consumer: {
                  groupId: configService.get<string>(`${groupId}`),
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
