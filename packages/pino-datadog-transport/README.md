# pino-datadog-transport

[![NPM version](https://img.shields.io/npm/v/pino-datadog-transport.svg?style=flat-square)](https://www.npmjs.com/package/pino-datadog-transport)
[![CircleCI](https://circleci.com/gh/theogravity/node-pino-datadog-transport.svg?style=svg)](https://circleci.com/gh/theogravity/pino-datadog-transport)
![built with typescript](https://camo.githubusercontent.com/92e9f7b1209bab9e3e9cd8cdf62f072a624da461/68747470733a2f2f666c61742e62616467656e2e6e65742f62616467652f4275696c74253230576974682f547970655363726970742f626c7565)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A [pino v7+](https://github.com/pinojs/pino) transport for sending logs to [Datadog](https://datadog.com/).

It uses [datadog-api-client-typescript](https://github.com/DataDog/datadog-api-client-typescript) to
send logs using the client [v2.LogsApi#submitLog](https://datadoghq.dev/datadog-api-client-typescript/classes/v2.LogsApi.html) method.

- Performs batch sending of logs on a periodic basis, or when log capacity is reached in overall log batch size or count.
- Will retry failed sends.
- Can disable batch sending and always send for each log entry.

## Table of Contents

<!-- TOC -->

- [Installation](#installation)
- [Configuration options](#configuration-options)
- [Implementing the `onError()` / `onDebug()` callback](#implementing-the-onerror--ondebug-callback)
- [Sending logs to Datadog with pino-socket instead](#sending-logs-to-datadog-with-pino-socket-instead)

<!-- TOC END -->

## Installation

`yarn add pino-datadog-transport`

```typescript
import { LoggerOptions, pino } from 'pino';

const pinoConf: LoggerOptions = {
  level: 'trace',
}

const logger = pino(pinoConf, pino.transport({
  target: 'pino-datadog-transport',
  options: {
    ddClientConf: {
      authMethods: {
        apiKeyAuth: <your datadog API key>
      }
    },
    ddServerConf: {
      // Note: This must match the site you use for your DataDog login - See below for more info
      site: "datadoghq.eu"
    }
  }
}))
```

## Configuration options

```typescript
export interface DDTransportOptions {
  /**
   * DataDog client configuration parameters.
   * @see https://datadoghq.dev/datadog-api-client-typescript/interfaces/client.Configuration.html
   */
  ddClientConf: ConfigurationParameters
  /**
   * Datadog server config for the client. Use this to change the Datadog server region.
   * @see https://github.com/DataDog/datadog-api-client-typescript/blob/1e1097c68a437894b482701ecbe3d61522429319/packages/datadog-api-client-common/servers.ts#L90
   */
  ddServerConf?: {
    /**
     * The datadog server to use. Default is datadoghq.com.
     * Other values could be:
     * - us3.datadoghq.com
     * - us5.datadoghq.com
     * - datadoghq.eu
     * - ddog-gov.com
     */
    site?: string
    subdomain?: string
    protocol?: string
  }
  /**
   * The integration name associated with your log: the technology from which
   * the log originated. When it matches an integration name, Datadog
   * automatically installs the corresponding parsers and facets.
   * @see https://docs.datadoghq.com/logs/log_collection/?tab=host#reserved-attributes
   */
  ddsource?: string
  /**
   * Comma separated tags associated with your logs. Ex: "env:prod,org:finance"
   */
  ddtags?: string
  /**
   * The name of the application or service generating the log events.
   * It is used to switch from Logs to APM, so make sure you define the same
   * value when you use both products.
   * @see https://docs.datadoghq.com/logs/log_collection/?tab=host#reserved-attributes
   */
  service?: string
  /**
   * Called when the plugin is ready to process logs.
   */
  onInit?: () => void
  /**
   * Error handler for when the submitLog() call fails. See readme on how to
   * properly implement this callback.
   */
  onError?: (err: any, logs?: Array<Record<string, any>>) => void
  /**
   * Define this callback to get debug messages from this transport
   */
  onDebug?: (msg: string) => void
  /**
   * Number of times to retry sending the log before onError() is called.
   * Default is 5.
   */
  retries?: number
  /**
   * Interval in which logs are sent to Datadog.
   * Default is 3000 milliseconds.
   */
  sendIntervalMs?: number
  /**
   * Set to true to disable batch sending and send each log as it comes in. This disables
   * the send interval.
   */
  sendImmediate?: boolean
}
```

## Implementing the `onError()` / `onDebug()` callback

You cannot specify the callbacks directly as they are [not serializable](https://github.com/pinojs/pino-pretty#handling-non-serializable-options).

Doing so will result in the following error:

```
DOMException [DataCloneError]: (e)=>{
} could not be cloned.
```

Instead, you need to create another file that implements it:

```typescript
// Your logger file
const p = pino({}, pino.transport({
    target: join(__dirname, 'pino-datadog-logger.js'),
    options: {
      ddClientConf: {
        authMethods: {
          apiKeyAuth: <your datadog API key>
        }
      },
    }
  }))
```

```typescript
/* eslint-disable */
// pino-datadog-logger.js
// https://github.com/pinojs/pino-pretty#handling-non-serializable-options
// Functions as options on the pino transport config are not serializable as they
// are workers, so we create this worker file which includes our callbacks

module.exports = (opts) => {
  return require('pino-datadog-logger')({
    ...opts,
    onError: (data, logItems) => {
      // Your error handling here
    }
  })
}
```

**Note: Log entries can only be a maximum of 1MB in size. This is a Datadog imposed limit.
This library will call onError() if a log entry is 0.95MB (to account for
serialization and metadata).**

## Sending logs to Datadog with pino-socket instead

It is possible to send logs to Datadog using [raw TCP](https://docs.datadoghq.com/logs/log_collection/?tab=tcp) instead of HTTPS. Datadog
recommends HTTPS as the logs are compress-able, whereas TCP-sent logs are not.
HTTPS also has content length limits, whereas TCP does not.

Datadog recommends sending logs over HTTPS instead of raw TCP, as the latest
version of the Datadog agent uses HTTPS with a TCP fallback:

```
// https://docs.datadoghq.com/agent/logs/log_transport?tab=https
For Agent v6.19+/v7.19+, the default transport used for your logs is
compressed HTTPS instead of TCP for the previous versions.
When the Agent starts, if log collection is enabled, it runs a
HTTPS connectivity test. If successful, then the Agent uses
the compressed HTTPS transport, otherwise the Agent falls back to a TCP transport.
```

However, you can send logs using raw TCP + TLS using [`pino-socket`](https://github.com/pinojs/pino-socket).

See instructions [here](https://github.com/pinojs/pino/issues/1511#issuecomment-1207472871) on how to do this.
