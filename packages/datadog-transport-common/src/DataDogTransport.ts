import type { HTTPLogItem } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/HTTPLogItem";
import type { LogsApiSubmitLogRequest } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/apis/LogsApi";
import { client, v2 } from "@datadog/datadog-api-client";
import pRetry from "./vendor/p-retry";
import exitHook from "./vendor/exit-hook";
import { LogStorage } from "./LogStorage";
import type { DDTransportOptions, SendLogOpts } from "./types";

// Define constants for various limits and intervals
const LOGS_PAYLOAD_SIZE_LIMIT = 5138022;
const LOG_SIZE_LIMIT = 996147;
const FORCE_SEND_MS = 3000;
const MAX_LOG_ITEMS = 995;

export class DataDogTransport {
  /**
   * Batch storage for logs
   */
  private logStorage: LogStorage;
  /**
   * Timer for sending log batches at specific intervals
   */
  private timer: ReturnType<typeof setInterval> | null = null;

  /**
   * Datadog Logs API v2 instance
   * @private
   */
  private apiInstance: v2.LogsApi;

  /**
   * Configuration options
   * @private
   */
  private config: DDTransportOptions;

  constructor(options: DDTransportOptions) {
    this.logStorage = new LogStorage();
    this.config = options;

    if (options.onInit) {
      options.onInit();
    }

    const configuration = client.createConfiguration(options.ddClientConf);

    configuration.setServerVariables(options?.ddServerConf || {});
    this.apiInstance = new v2.LogsApi(configuration);

    this.setupRegularSend();
    this.setupExitHook();
  }

  /**
   * Performs the actual sending of logs to datadog
   * @private
   */
  private sendLogs({ logsToSend, bucketName }: Omit<SendLogOpts, "apiInstance" | "options">) {
    pRetry(
      async () => {
        const params: LogsApiSubmitLogRequest = {
          body: logsToSend, // Logs to send
          contentEncoding: "gzip", // Encoding type
        };

        // Attempt to send logs via API
        const result = await this.apiInstance.submitLog(params);
        if (this.config.onDebug) {
          this.config.onDebug(`(${bucketName}) Sending ${logsToSend.length} logs to Datadog completed`);
        }

        return result;
      },
      { retries: this.config.retries ?? 5 },
    ).catch((err) => {
      if (this.config.onError) {
        this.config.onError(err, logsToSend);
      }
    });
  }

  /**
   * Sets up interval timer for sending logs periodically
   */
  private setupRegularSend() {
    if (!this.config.sendImmediate) {
      if (this.config.onDebug) {
        this.config.onDebug(`Configured to send logs every ${this.config.sendIntervalMs || FORCE_SEND_MS}ms`);
      }

      this.timer = setInterval(() => {
        const logCount = this.logStorage.getLogCount();
        const currentBucket = this.logStorage.currentBucket;

        if (logCount > 0) {
          if (this.config.onDebug) {
            this.config.onDebug(`(${currentBucket}) Sending ${logCount} logs to Datadog on timer`);
          }

          this.sendLogs({
            logsToSend: this.logStorage.finishLogBatch(),
            bucketName: currentBucket,
          });
        }
      }, this.config.sendIntervalMs || FORCE_SEND_MS);
    }
  }

  /**
   * Sets up a hook to send any remaining logs on application exit
   */
  private setupExitHook() {
    if (this.config.onDebug) {
      this.config.onDebug("Configuring exit hook");
    }

    exitHook(() => {
      if (this.logStorage.getLogCount() > 0) {
        if (this.config.onDebug) {
          this.config.onDebug("Shutdown detected. Attempting to send remaining logs to Datadog");
        }
        if (this.timer) {
          clearInterval(this.timer);
        }

        const currentBucket = this.logStorage.currentBucket;

        this.sendLogs({
          logsToSend: this.logStorage.finishLogBatch(),
          bucketName: currentBucket,
        });
      }
    });
  }

  /**
   * Submits log data to be queued or sent to datadog
   */
  processLog(data: Record<string, any>) {
    const logItem: HTTPLogItem = {
      message: JSON.stringify(data),
    };

    if (this.config.ddsource) {
      logItem.ddsource = this.config.ddsource;
    }

    if (this.config.ddtags) {
      logItem.ddtags = this.config.ddtags;
    }

    if (this.config.service) {
      logItem.service = this.config.service;
    }

    const logEntryLength =
      logItem.message.length +
      (logItem.ddsource?.length || 0) +
      (logItem.ddtags?.length || 0) +
      (logItem.hostname?.length || 0) +
      (logItem.service?.length || 0);

    if (logEntryLength > LOG_SIZE_LIMIT) {
      if (this.config.onError) {
        this.config.onError(new Error(`Log entry exceeds size limit of ${LOG_SIZE_LIMIT} bytes: ${logEntryLength}`), [
          logItem,
        ]);
      }
    }

    // If the logs are to be sent right away
    if (this.config.sendImmediate) {
      if (this.config.onDebug) {
        this.config.onDebug("(send-immediate) Sending log to Datadog");
      }

      this.sendLogs({
        logsToSend: [logItem],
        bucketName: "send-immediate",
      });

      return;
    }

    // Logs are not to be sent right away, queue them
    this.logStorage.addLog(logItem, logEntryLength);

    // Check if logs should be sent based on size or count
    const logCount = this.logStorage.getLogCount();
    const shouldSend = this.logStorage.getLogBucketByteSize() > LOGS_PAYLOAD_SIZE_LIMIT || logCount > MAX_LOG_ITEMS;

    if (shouldSend) {
      const currentBucket = this.logStorage.currentBucket;

      if (this.config.onDebug) {
        this.config.onDebug(`(${currentBucket}) Sending ${logCount} logs to Datadog`);
      }

      this.sendLogs({
        logsToSend: this.logStorage.finishLogBatch(),
        bucketName: currentBucket,
      });
    }
  }
}
