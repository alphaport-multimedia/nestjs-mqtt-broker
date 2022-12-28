import { Provider } from '@nestjs/common';
import { INSTANCE_BROKER, OPTION_PROVIDER } from './mqtt.constant';
import { MqttModuleAsyncOptions, MqttOptionsFactory } from './mqtt.interface';

export function createOptionsProvider(
  options: MqttModuleAsyncOptions
): Provider {
  if (options.useFactory) {
    return {
      provide: OPTION_PROVIDER,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  if (options.useExisting) {
    return {
      provide: OPTION_PROVIDER,
      useFactory: async (optionsFactory: MqttOptionsFactory) =>
        await optionsFactory.createConnectOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}

export function createOptionProviders(
  options: MqttModuleAsyncOptions
): Provider[] {
  if (options.useExisting || options.useFactory) {
    return [createOptionsProvider(options)];
  }
  return [
    {
      provide: INSTANCE_BROKER,
      useFactory: async (optionFactory: MqttOptionsFactory) =>
        await optionFactory.createConnectOptions(),
      inject: [options.useClass],
    },
    {
      provide: options.useClass,
      useClass: options.useClass,
    },
  ];
}
