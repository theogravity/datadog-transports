# datadog-transport-common

[![NPM version](https://img.shields.io/npm/v/datadog-transport-common.svg?style=flat-square)](https://www.npmjs.com/package/datadog-transport-common) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A generic library used for sending logs to datadog. 

# Installation

`npm i datadog-transport-common`

# Usage

```typescript
import { DataDogTransport } from 'datadog-transport-common'

const transport = new DataDogTransport(options)

// Assemble your data to send to datadog
// Shove whatever you want here
const data = { }

// queue for send or send immediately (depending on options set)
transport.processLog(data)
```

# Configuration options

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
   * Default is "Electron"
   * @see https://docs.datadoghq.com/logs/log_collection/?tab=host#reserved-attributes
   */
  service?: string
  /**
   * Called when the plugin is ready to process logs.
   */
  onInit?: () => void
  /**
   * Error handler for when the submitLog() call fails.
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
