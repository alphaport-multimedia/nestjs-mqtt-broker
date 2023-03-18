import { Inject, Injectable } from '@nestjs/common';
import Aedes from 'aedes/types/instance';
import { INSTANCE_BROKER } from './mqtt.constant';
import { PubPacket } from './mqtt.interface';

@Injectable()
export class MqttService {
  constructor(@Inject(INSTANCE_BROKER) private readonly broker: Aedes) {}

  publish(packet: PubPacket): Promise<PubPacket> {
    return new Promise<any>((resolve, reject) => {
      this.broker.publish(packet, error => {
        if (!error) {
          return resolve(packet);
        }
        return reject(error);
      });
    });
  }
}
