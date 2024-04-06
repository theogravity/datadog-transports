# electron-log-transport-datadog

[![NPM version](https://img.shields.io/npm/v/electron-log-transport-datadog.svg?style=flat-square)](https://www.npmjs.com/package/electron-log-transport-datadog) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

Send logs from [electron-log](https://npmjs.com/package/electron-log) to [Datadog](https://www.datadoghq.com/).

It uses [datadog-api-client-typescript](https://github.com/DataDog/datadog-api-client-typescript) to
send logs using the client [v2.LogsApi#submitLog](https://datadoghq.dev/datadog-api-client-typescript/classes/v2.LogsApi.html) method.

- Performs batch sending of logs on a periodic basis, or when log capacity is reached in overall log batch size or count.
- Will retry failed sends.
- Can disable batch sending and always send for each log entry.

**Note: This transport only works in the main process since the Datadog API client is not compatible with the renderer process.**

# Table of contents

- [Installation](#installation)
- [Configuration options](#configuration-options)
- [Logging](#logging)
  - [Log entry format sent to datadog](#log-entry-format-sent-to-datadog)
  - [Log entry format behavior](#log-entry-format-behavior)
  - [Adding context data for all logs](#adding-context-data-for-all-logs)

# Installation

`yarn add electron-log-transport-datadog`

```typescript
import { dataDogTransport } from 'electron-log-transport-datadog';
import log from 'electron-log/src/main';

log.transports.datadog = dataDogTransport({
  ddClientConf: {
    authMethods: {
      apiKeyAuth: 'YOUR_API_KEY',
    },
  },
  onDebug: (msg) => {
    console.log(msg);
  },
  onError: (err, logs) => {
    console.error(err, logs);
  },
});
```

# Configuration options

```typescript
export interface ElectronLogTransportOpts {
  /**
   * DataDog client configuration parameters.
   * @see https://datadoghq.dev/datadog-api-client-typescript/interfaces/client.Configuration.html
   */
  ddClientConf: ConfigurationParameters;
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
    site?: string;
    subdomain?: string;
    protocol?: string;
  };
  /**
   * The integration name associated with your log: the technology from which
   * the log originated. When it matches an integration name, Datadog
   * automatically installs the corresponding parsers and facets.
   * @see https://docs.datadoghq.com/logs/log_collection/?tab=host#reserved-attributes
   */
  ddsource?: string;
  /**
   * Comma separated tags associated with your logs. Ex: "env:prod,org:finance"
   */
  ddtags?: string;
  /**
   * The name of the application or service generating the log events.
   * It is used to switch from Logs to APM, so make sure you define the same
   * value when you use both products.
   * @see https://docs.datadoghq.com/logs/log_collection/?tab=host#reserved-attributes
   */
  service?: string;
  /**
   * Called when the plugin is ready to process logs.
   */
  onInit?: () => void;
  /**
   * Error handler for when the submitLog() call fails. See readme on how to
   * properly implement this callback.
   */
  onError?: (err: any, logs?: Array<Record<string, any>>) => void;
  /**
   * Define this callback to get debug messages from this transport
   */
  onDebug?: (msg: string) => void;
  /**
   * Number of times to retry sending the log before onError() is called.
   * Default is 5.
   */
  retries?: number;
  /**
   * Interval in which logs are sent to Datadog.
   * Default is 3000 milliseconds.
   */
  sendIntervalMs?: number;
  /**
   * Set to true to disable batch sending and send each log as it comes in. This disables
   * the send interval.
   */
  sendImmediate?: boolean;
  /**
   * Set to assign a field to store all object metadata in the log object that is sent to datadog.
   */
  metadataField?: string;
  /**
   * Set to re-assign the field that stores all array metadata in the log object that is sent to datadog.
   * Default is "arrayData".
   */
  arrayDataField?: string;
}
```

# Logging

It is recommended you use [`loglayer`](https://github.com/theogravity/loglayer?tab=readme-ov-file#electron-log) with `electron-log` so you have a consistent logging experience across your application. It will provide standard ways
to define metadata, handle errors, and more.

## Log entry format sent to datadog

```json
{
  "message": "This is a log message",
  "date": <millisecond unix timestamp>,
  "level": "info",
  "arrayData": [
    "some",
    "array",
    "data"
  ],
  ...<metadata>
}
```

## Log entry format behavior

Because `electron-log` lets you shove anything into the log methods, the following logic is applied in forming
the log entry to send to Datadog:

- If the log entry contains a string, it will be used as the `message` field. Multiple strings will be concatenated.
- If the log entry contains an object, the fields will be added to `metadata` (the log entry root).
  * You can set a field to store all object metadata in the log object that is sent to datadog using the `metadataField` option.
- If the log entry contains an array, it will be added to the `arrayData` field.
  * You can set a field to store all array metadata in the log object that is sent to datadog using the `arrayDataField` option.

## Adding context data for all logs

You'll probably want to associate a user to the logs you send to datadog, or add other kinds of data. 
If you use [`loglayer`](https://github.com/theogravity/loglayer/blob/master/README.md#electron-log), you can 
use the context feature to add something like a `userId` to the metadata. This will be sent to Datadog with each log entry.

```typescript
import { LogLayer } from 'loglayer';
import log from 'electron-log/src/main';

const logger = new LogLayer({
  logger: {
    instance: log,
    type: LoggerType.ELECTRON_LOG,
  },
  // See LogLayer documentation for more options
  // like setting the field for context data
  context: {
    fieldName: 'context',
  },
  metadata: {
    fieldName: 'metadata',
  },
}).withContext({
  // or whatever you use to identify the user
  userId: '1234',
  electronVersion: "v1.2.3"
});

export function getLogger() {
    return logger;
}
```

```typescript
// Will send the log entry to Datadog with the metadata field containing the userId, electronVersion and some metadata.
getLogger().withMetadata({ some: 'metadata' }).info('This is a log message');
```
