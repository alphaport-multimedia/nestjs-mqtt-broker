import { Logger, Provider } from '@nestjs/common';
import { Aedes } from 'aedes';
import { createServer } from 'aedes-server-factory';
import { INSTANCE_BROKER, OPTION_PROVIDER } from './mqtt.constant';
import { MqttModuleOptions } from './mqtt.interface';
import { MqttModule } from './mqtt.module';

export function createClientProvider(): Provider {
  return {
    provide: INSTANCE_BROKER,
    useFactory: async (options: MqttModuleOptions) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const broker: Aedes = require('aedes')(options);
      await createServer(broker, { ws: true }).listen(options.port);
      Logger.log(`🚀 MQTT Broker is running on: ws://localhost:${options.port}`, MqttModule.name);
      return broker;
    },
    inject: [OPTION_PROVIDER],
  };
}
