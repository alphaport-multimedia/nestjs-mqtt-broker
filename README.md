
[![pipeline status](https://github.com/alphaport-multimedia/nestjs-mqtt-broker/actions/workflows/node.js.yml/badge.svg)](https://github.com/alphaport-multimedia/nestjs-mqtt-broker/commits/main)
[![publish status](https://github.com/alphaport-multimedia/nestjs-mqtt-broker/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/alphaport-multimedia/nestjs-mqtt-broker/commits/main)
[![npm](https://img.shields.io/npm/v/nestjs-mqtt-broker)](https://www.npmjs.com/package/nestjs-mqtt-broker)


`nestjs-mqtt-broker` is a [NestJS](https://nestjs.com/) module that provides an integration with [aedes](https://github.com/moscajs/aedes) MQTT broker

### Installation

```
npm i @alphaport/nestjs-mqtt-broker
```

### Usage

```
@Module({
  imports: [
    MqttModule.forRoot({
      port: "1883", // Port MQTT TCP Server
      portWS: "1884", // Port MQTT WebSocket Server
      id: "mqtt-broker",
      concurrency:100,
      queueLimit:42,
      maxClientsIdLength:23,
      connectTimeout:30000,
      heartbeatInterval:60000,
     })
  ],
})
```

```
app.enableShutdownHooks();
```

# Attributions

- Based on Pigeon MQTT Nest.JS https://github.com/behnamnasehi/pigeon-mqtt-nest

# License

```text
MIT License

Copyright (c) 2021 behnamnasehi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
