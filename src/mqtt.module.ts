import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { OPTION_PROVIDER } from './mqtt.constant';
import { MqttExplorer } from './mqtt.explorer';
import { MqttModuleAsyncOptions, MqttModuleOptions } from './mqtt.interface';
import { createClientProvider } from './mqtt.provider';
import { MqttService } from './mqtt.service';
import { createOptionProviders } from './option.provider';

@Global()
@Module({
  imports: [DiscoveryModule],
  exports: [MqttService],
})
export class MqttModule {
  public static forRootAsync(options: MqttModuleAsyncOptions): DynamicModule {
    return {
      module: MqttModule,
      providers: [
        ...createOptionProviders(options),
        createClientProvider(),
        MqttExplorer,
        MqttService,
      ],
    };
  }

  public static forRoot(options: MqttModuleOptions): DynamicModule {
    return {
      module: MqttModule,
      providers: [
        {
          provide: OPTION_PROVIDER,
          useValue: options,
        },
        createClientProvider(),
        MqttExplorer,
        MqttService,
      ],
    };
  }
}
