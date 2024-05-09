import { Transport } from '@nestjs/microservices';

export class KafkaService {
  static getOptions(groupId: string, broker: string) {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [broker],
        },
        consumer: {
          groupId,
        },
      },
    };
  }
}
