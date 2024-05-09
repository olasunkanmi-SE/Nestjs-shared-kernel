export interface IClientKafka {
  name: string;
  transport: number;
  options: IClientOpt;
}

interface IClientOpt {
  client: IClient;
  consumer: IConsumerGroup;
}

interface IClient {
  clientId: string;
  brokers: string[];
}

interface IConsumerGroup {
  groupId: string;
}

export interface IKafkaConfig {
  name: string;
  groupId: string;
  clientId: string;
}
