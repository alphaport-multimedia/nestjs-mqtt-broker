import { Logger, Provider } from '@nestjs/common';
import * as net from 'net';
import { createBroker } from 'aedes';
import Aedes from 'aedes/types/instance';
import { createServer } from 'http';
import { INSTANCE_BROKER, OPTION_PROVIDER } from './mqtt.constant';
import { MqttModuleOptions } from './mqtt.interface';
import { MqttModule } from './mqtt.module';

export function createClientProvider(): Provider {
  return {
    provide: INSTANCE_BROKER,
    useFactory: async (options: MqttModuleOptions) => {
      const broker: Aedes = createBroker(options);

      // TCP Server
      if (options.port) {
        const server: net.Server = await net.createServer(broker.handle);
        server.listen(options.port, () => {
          Logger.log(`🚀 MQTT Broker is running on: tcp://localhost:${options.port}`, MqttModule.name);
        });
      }

      // WebSocket Server
      if (options.portWS) {
        const server = await createServer();
        const ws = require('websocket-stream');
        ws.createServer({ server }, broker.handle);
        server.listen(options.port, () => {
          Logger.log(`🚀 MQTT Broker is running on: ws://localhost:${options.portWS}`, MqttModule.name);
        });
      }

      return broker;
    },
    inject: [OPTION_PROVIDER],
  };
}
