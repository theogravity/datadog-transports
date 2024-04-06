import type { HTTPLogItem } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/HTTPLogItem";

function generateCurrentPointer() {
  return `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

interface LogBucketData {
  /**
   * Size of the items in bytes
   */
  size: number;
  logItems: Array<HTTPLogItem>;
}

/**
 * Manages storage of log data into buckets.
 */
export class LogStorage {
  /**
   * Identifier for the current log bucket.
   * @type {string}
   */
  // @ts-ignore
  currentBucket: string;

  /**
   * Stores the log data buckets by their identifiers.
   * @type {Record<string, LogBucketData>}
   * @private
   */
  private logBucket: Record<string, LogBucketData>;

  /**
   * Initializes the log storage and creates the first log bucket.
   */
  constructor() {
    this.logBucket = {};
    this.newLogBucket();
  }

  /**
   * Creates a new log bucket, deleting the current one if it exists.
   * @private
   */
  private newLogBucket() {
    if (this.currentBucket) {
      delete this.logBucket[this.currentBucket];
    }

    this.currentBucket = generateCurrentPointer();
    this.logBucket[this.currentBucket] = {
      size: 0,
      logItems: [],
    };
  }

  /**
   * Retrieves the byte size of the current log bucket.
   * @returns {number} The size of the current log bucket in bytes.
   */
  getLogBucketByteSize(): number {
    return this.logBucket[this.currentBucket].size;
  }

  /**
   * Gets the count of logs in the current log bucket.
   * @returns {number} The number of log items in the current bucket.
   */
  getLogCount(): number {
    return this.logBucket[this.currentBucket].logItems.length;
  }

  /**
   * Finishes the current log batch, returning its logs and creating a new log bucket.
   * @returns {Array<HTTPLogItem>} The log items from the finished log bucket.
   */
  finishLogBatch(): Array<HTTPLogItem> {
    const logs = this.logBucket[this.currentBucket].logItems;

    this.newLogBucket();

    return logs;
  }

  /**
   * Adds a log item to the current log bucket.
   * @param {HTTPLogItem} log - The log item to be added.
   * @param {number} logByteSize - The size of the log item in bytes.
   */
  addLog(log: HTTPLogItem, logByteSize: number) {
    this.logBucket[this.currentBucket].size += logByteSize;
    this.logBucket[this.currentBucket].logItems.push(log);
  }
}
