export const KEY_SUBSCRIBE_OPTIONS = '__mqtt_subscribe_options';
export const KEY_SUBSCRIBER_PARAMS = '__mqtt_subscriber_params';

export const INSTANCE_BROKER = 'INSTANCE_BROKER';
export const OPTION_PROVIDER = 'MQTT_OPTION_PROVIDER';

export enum SystemTopicsEnum {
  PUBLISH = '$MQTT/new/publish',
  CLIENT_READY = '$MQTT/event/ready/clients',
  CLIENT = '$MQTT/event/clients',
  CLIENT_DISCONNECT = '$MQTT/event/disconnect/clients',
  CLIENT_ERROR = '$MQTT/event/error/clients',
  KEEP_LIVE_TIMEOUT = '$MQTT/event/keepalivetimeout',
  ACK = '$MQTT/event/ack',
  PING = '$MQTT/event/ping',
  CONNACK_SENT = '$MQTT/event/connack/sent',
  CLOSED = '$MQTT/event/closed',
  CONNECTION_ERROR = '$MQTT/event/error/connection',
  SUBSCRIBES = '$MQTT/event/subscribes',
  UNSUBSCRIBES = '$MQTT/event/unsubscribes',
  AUTHENTICATE = '$MQTT/handle/authenticate',
  PRE_CONNECT = '$MQTT/handle/preconnect',
  AUTHORIZE_PUBLISH = '$MQTT/handle/authorizePublish',
  AUTHORIZE_SUBSCRIBE = '$MQTT/handle/authorizeSubscribe',
  AUTHORIZE_FORWARD = '$MQTT/handle/authorizeForward',
  PUBLISHED = '$MQTT/handle/published',
}

export const SystemTopicRegexEnum = {
  CLIENT_NEW: /^\$?SYS\/([^/\n]*)\/new\/clients/,
  CLIENT_READY: /^\$?AEDES\/ready\/clients/,
  CLIENT_DISCONNECT: /^\$?SYS\/([^/\n]*)\/disconnect\/clients/,
  PUBLISH: /^\$?AEDES\/new\/publish/,
  PING: /^\$?AEDES\/ping/,
  HEART_BEAT: /^\$?SYS\/([^/\n]*)\/heartbeat/,
  SUBSCRIBES: /^\$?SYS\/([^/\n]*)\/new\/subscribes/,
  UNSUBSCRIBES: /^\$?SYS\/([^/\n]*)\/new\/unsubscribes/,
};
