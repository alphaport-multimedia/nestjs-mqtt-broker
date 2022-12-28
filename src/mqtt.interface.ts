import { LoggerService, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { AedesOptions } from 'aedes';
import { PublishPacket } from 'aedes:packet';

export type MqttMessageTransformer<T> = (payload: string | Buffer) => T;

export type LoggerConstructor = new (...params) => LoggerService;

export interface MqttSubscribeOptions {
  topic: string | string[];
  queue?: boolean;
  share?: string;
  transform?: 'json' | 'text' | MqttMessageTransformer<unknown>;
}

export interface PubPacket extends PublishPacket {
  cmd: 'publish';
  qos: 0 | 1 | 2;
  topic: string;
  payload: string | Buffer;
}

export class CredentialInterface {
  username: string;
  password: Buffer;
}

export interface MqttSubscriberParameter {
  index: number;
  type:
    | 'error'
    | 'payload'
    | 'topic'
    | 'publish'
    | 'packet'
    | 'client'
    | 'host'
    | 'subscription'
    | 'function'
    | 'credential';
  transform?: 'json' | 'text' | MqttMessageTransformer<unknown>;
}

export interface MqttLoggerOptions {
  useValue?: LoggerService;
  useClass?: Type<LoggerService>;
}

export interface MqttModuleOptions extends AedesOptions {
  port: string;
}

export interface MqttOptionsFactory {
  createConnectOptions(): Promise<MqttModuleOptions> | MqttModuleOptions;
}

export interface MqttModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<MqttOptionsFactory>;
  useClass?: Type<MqttOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<MqttModuleOptions> | MqttModuleOptions;
  logger?: MqttLoggerOptions;
}
