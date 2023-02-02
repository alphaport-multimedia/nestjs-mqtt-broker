import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { KEY_SUBSCRIBER_PARAMS, KEY_SUBSCRIBE_OPTIONS, SystemTopicRegexEnum, SystemTopicsEnum } from './mqtt.constant';
import { MqttMessageTransformer, MqttSubscribeOptions, MqttSubscriberParameter } from './mqtt.interface';

export function ListenOn(topic: string | string[] | RegExp | RegExp[] | MqttSubscribeOptions): CustomDecorator;
export function ListenOn(topicOrOptions): CustomDecorator {
  if (typeof topicOrOptions === 'string' || Array.isArray(topicOrOptions)) {
    return SetMetadata(KEY_SUBSCRIBE_OPTIONS, {
      topic: topicOrOptions,
    });
  } else {
    return SetMetadata(KEY_SUBSCRIBE_OPTIONS, topicOrOptions);
  }
}

export function OnHeartBeat(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicRegexEnum.HEART_BEAT);
}

export function OnPublish(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.PUBLISH);
}

export function OnClientReady(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.CLIENT_READY);
}

export function OnClient(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.CLIENT);
}

export function OnClientDisconnect(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.CLIENT_DISCONNECT);
}

export function OnClientError(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.CLIENT_ERROR);
}

export function OnSubscribe(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.SUBSCRIBES);
}

export function OnUnsubscribe(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.UNSUBSCRIBES);
}

export function OnAuthenticate(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.AUTHENTICATE);
}

/* Handle on
 *
 */
export function OnPreConnect(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.PRE_CONNECT);
}

export function OnAuthorizePublish(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.AUTHORIZE_PUBLISH);
}

export function OnAuthorizeSubscribe(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.AUTHORIZE_SUBSCRIBE);
}

export function OnAuthorizeForward(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.AUTHORIZE_FORWARD);
}

export function OnPublished(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.PUBLISHED);
}

export function OnKeepLiveTimeout(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.KEEP_LIVE_TIMEOUT);
}

export function OnAck(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.ACK);
}

export function OnConnackSent(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.CONNACK_SENT);
}

export function OnClosed(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.CLOSED);
}

export function OnConnectionError(): CustomDecorator {
  return SetMetadata(KEY_SUBSCRIBE_OPTIONS, SystemTopicsEnum.CONNECTION_ERROR);
}

function SetParameter(parameter: Partial<MqttSubscriberParameter>) {
  return (target: object, propertyKey: string | symbol, paramIndex: number) => {
    const params = Reflect.getMetadata(KEY_SUBSCRIBER_PARAMS, target[propertyKey]) || [];
    params.push({
      index: paramIndex,
      ...parameter,
    });
    Reflect.defineMetadata(KEY_SUBSCRIBER_PARAMS, params, target[propertyKey]);
  };
}

/**
 * Take the topic in parameters.
 * @constructor
 */
export function Topic() {
  return SetParameter({
    type: 'topic',
    transform: 'text',
  });
}

/**
 * Take the payload in parameters.
 * @param transform
 * @constructor
 */
export function Payload(transform?: 'json' | 'text' | MqttMessageTransformer<unknown>) {
  return SetParameter({
    type: 'payload',
    transform: 'text',
  });
}

export function Client(transform?: 'json' | 'text' | MqttMessageTransformer<unknown>) {
  return SetParameter({
    type: 'client',
    transform: 'text',
  });
}

/**
 * Take an array as parameter of a topic with wildcard.
 * Such like topic: foo/+/bar/+, you will get an array like:
 * ['first', 'second']
 */
export function Packet() {
  return SetParameter({
    type: 'packet',
  });
}

export function Subscription() {
  return SetParameter({
    type: 'subscription',
  });
}
export function Subscriptions() {
  return SetParameter({
    type: 'subscriptions',
  });
}

export function Function() {
  return SetParameter({
    type: 'function',
    transform: s => s,
  });
}

export function Credential() {
  return SetParameter({
    type: 'credential',
  });
}

export function Host() {
  return SetParameter({
    type: 'host',
  });
}

export function Error() {
  return SetParameter({
    type: 'error',
  });
}
