import { MqttMessageTransformer } from './mqtt.interface';
type JSONValue = string | number | boolean | JSONObject | JSONArray;
type JSONArray = Array<JSONValue>;

interface JSONObject {
  [x: string]: JSONValue;
}

export const JsonTransform: MqttMessageTransformer<JSONObject> = (payload?: string | Buffer) => {
  console.log(payload.toString('utf-8'));
  return JSON.parse(payload.toString('utf-8'));
};

export const TextTransform: MqttMessageTransformer<string> = (payload?: string | Buffer) => {
  console.log(payload);
  return payload.toString('utf-8');
};

export function getTransform(transform?: 'json' | 'text' | MqttMessageTransformer<unknown>) {
  if (typeof transform === 'function') {
    return transform;
  } else {
    if (transform === 'json') {
      return JsonTransform;
    } else {
      return TextTransform;
    }
  }
}
