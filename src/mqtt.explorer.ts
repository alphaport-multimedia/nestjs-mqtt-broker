import { DiscoveredMethodWithMeta, DiscoveryService } from '@golevelup/nestjs-discovery';
import { Inject, Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Aedes } from 'aedes';
import { Client } from 'aedes:client';

import { ConnackPacket, ConnectPacket, PingreqPacket, PublishPacket, PubrelPacket, Subscription } from 'aedes:packet';
import { IPacket } from 'mqtt-packet';
import { isRegExp } from 'util/types';
import {
  INSTANCE_BROKER,
  KEY_SUBSCRIBER_PARAMS,
  KEY_SUBSCRIBE_OPTIONS,
  OPTION_PROVIDER,
  SystemTopicRegexEnum,
  SystemTopicsEnum
} from './mqtt.constant';
import { MqttModuleOptions, MqttSubscriberParameter } from './mqtt.interface';
import { getTransform } from './mqtt.transfrom';

type DiscoveredMethodWithMetaAndParameters<T> = DiscoveredMethodWithMeta<T> & {
  params: MqttSubscriberParameter[];
};

type HandlerMethodParameters = {
  client?: Client;
  packet?: IPacket;
  subscription?: Subscription[];
  unsubscription?: string[];
  callback?: (...args: unknown[]) => unknown;
  username?: string;
  password?: Readonly<Buffer>;
  error?;
};
@Injectable()
export class MqttExplorer implements OnModuleInit, OnApplicationShutdown {
  private readonly logger: Logger = new Logger(MqttExplorer.name);
  private readonly reflector = new Reflector();

  constructor(
    private readonly discoveryService: DiscoveryService,
    @Inject(OPTION_PROVIDER) private readonly options: MqttModuleOptions,
    @Inject(INSTANCE_BROKER) private readonly broker: Aedes
  ) {}

  onModuleInit() {
    this.init();
  }

  async onApplicationShutdown() {
    await new Promise<void>((resolve) => this.broker.close(() => resolve()));
  }

  async init() {
    const providers: DiscoveredMethodWithMetaAndParameters<string>[] = (
      await this.discoveryService.providerMethodsWithMetaAtKey<string>(KEY_SUBSCRIBE_OPTIONS)
    ).map((p) => ({
      ...p,
      params: this.getMethodParameters(p),
    }));

    this.broker.preConnect = (client: Client, packet: ConnectPacket, callback) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.PRE_CONNECT, providers), {
        client,
        packet,
        callback,
      });
    };

    this.broker.on('clientDisconnect', (client: Client) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.CLIENT_DISCONNECT, providers), { client });
    });

    this.broker.authenticate = (client: Client, username: Readonly<string>, password: Readonly<Buffer>, callback) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.AUTHENTICATE, providers), {
        client,
        callback,
        username,
        password,
      });
    };

    this.broker.authorizePublish = (client: Client, packet: PublishPacket, callback) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.AUTHORIZE_PUBLISH, providers), {
        client,
        packet,
        callback,
      });
    };

    this.broker.authorizeSubscribe = (client: Client, subscription: Subscription, callback) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.AUTHORIZE_SUBSCRIBE, providers), {
        client,
        subscription: [subscription],
        callback,
      });
    };

    this.broker.authorizeForward = (client: Client, packet: PublishPacket) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.AUTHORIZE_FORWARD, providers), {
        client,
        packet,
      });
    };

    this.broker.published = (packet: PublishPacket, client: Client, callback) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.PUBLISHED, providers), {
        client,
        packet,
        callback,
      });
    };

    this.broker.on('publish', (packet: PublishPacket, client: Client) => {
      let subscriber = [];

      if (SystemTopicRegexEnum.HEART_BEAT.test(packet.topic)) {
        subscriber = this.getSubscribers(SystemTopicRegexEnum.HEART_BEAT, providers);
      } else {
        subscriber = [
          ...this.getSubscribers(packet.topic, providers),
          ...this.getSubscribers(SystemTopicsEnum.PUBLISH, providers),
        ];
      }

      this.processHandlerListener(subscriber, { client, packet });
    });

    this.broker.on('clientReady', (client: Client) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.CLIENT_READY, providers), { client });
    });

    this.broker.on('client', (client: Client) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.CLIENT, providers), { client });
    });

    this.broker.on('clientError', (client: Client, error: Error) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.CLIENT_ERROR, providers), { client, error });
    });

    this.broker.on('subscribe', (subscription: Subscription[], client: Client) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.SUBSCRIBES, providers), {
        client,
        subscription,
      });
    });

    this.broker.on('unsubscribe', (unsubscription: string[], client: Client) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.UNSUBSCRIBES, providers), {
        client,
        unsubscription,
      });
    });

    this.broker.on('ping', (packet: PingreqPacket, client: Client) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.PING, providers), { client, packet });
    });

    this.broker.on('connectionError', (client: Client, error: Error) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.CONNECTION_ERROR, providers), { client, error });
    });

    this.broker.on('keepaliveTimeout', (client: Client) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.KEEP_LIVE_TIMEOUT, providers), { client });
    });

    this.broker.on('ack', (packet: PublishPacket | PubrelPacket, client: Client) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.ACK, providers), { client, packet });
    });

    this.broker.on('closed', () => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.CLOSED, providers));
    });

    this.broker.on('connackSent', (packet: ConnackPacket, client: Client) => {
      this.processHandlerListener(this.getSubscribers(SystemTopicsEnum.CONNACK_SENT, providers), { client, packet });
    });

    for (const provider of providers) {
      this.logger.log(
        `Mapped {${provider.discoveredMethod.parentClass.name}::${
          provider.discoveredMethod.methodName
        }, ${provider.params.map((p) => `${p.type}`).join(', ')}} mqtt subscribtion`
      );
    }
  }

  processHandlerListener(
    subscribers: DiscoveredMethodWithMetaAndParameters<string>[],
    params?: HandlerMethodParameters
  ) {
    for (const subscriber of subscribers) {
      try {
        subscriber.discoveredMethod.handler.bind(subscriber.discoveredMethod.parentClass.instance)(
          ...this.getHandlerMethodParameters(subscriber.params, params)
        );
      } catch (err) {
        this.logger.error(err);
      }
    }
  }

  getHost() {
    return {
      id: this.broker.id,
      connectedClients: this.broker.connectedClients,
    };
  }

  private getMethodParameters(subscriber: DiscoveredMethodWithMeta<string>): MqttSubscriberParameter[] {
    const parameters = this.reflector.get<MqttSubscriberParameter[]>(
      KEY_SUBSCRIBER_PARAMS,
      subscriber.discoveredMethod.handler
    );

    const orderedParameters: MqttSubscriberParameter[] = [];
    for (const parameter of parameters) {
      orderedParameters[parameter.index] = parameter;
    }
    return orderedParameters;
  }

  private getSubscribers(
    metaKey: string | RegExp,
    providers: DiscoveredMethodWithMetaAndParameters<string>[],
    single = false
  ): DiscoveredMethodWithMetaAndParameters<string>[] {
    const subscribers =  providers.filter((p) => {
      return (isRegExp(metaKey) && metaKey.test(p.meta)) || p.meta === metaKey;
    });
    if (single && subscribers.length > 0) {
      return subscribers[0];
    }
    return subscribers;
  }

  private getHandlerMethodParameters(parameters: MqttSubscriberParameter[], params?: HandlerMethodParameters) {
    return parameters.map((parameter) => {
      switch (parameter?.type) {
        case 'client':
          return params?.client;
        case 'host':
          return this.getHost();
        case 'credential':
          return {
            username: params?.username,
            password: params?.password,
          };
        case 'function':
          return params?.callback;
        case 'subscription':
          return params?.subscription;
        case 'payload':
          return getTransform(parameter.transform)((params?.packet as PublishPacket).payload);
        case 'error':
          return params?.error;
        case 'packet':
          return params?.packet;
        default:
          return null;
      }
    });
  }
}
