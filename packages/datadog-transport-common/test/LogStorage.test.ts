import { describe, it, expect, vi, beforeEach } from "vitest";
import { LogStorage } from "../src";
import type { HTTPLogItem } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/HTTPLogItem";

describe("LogStorage", () => {
  // Mock helper to update `Math.random` and `Date.now`
  const mockMathRandom = (values: number[]) => {
    const originalMath = Object.create(global.Math);
    let randomCalls = 0;
    global.Math.random = () => {
      return values[randomCalls++ % values.length];
    };
    // biome-ignore lint/suspicious/noAssignInExpressions: It's a mock
    return () => (global.Math = originalMath);
  };

  const mockDateNow = (timestamps: number[]) => {
    let dateNowCalls = 0;
    vi.stubGlobal("Date", {
      now: () => {
        return timestamps[dateNowCalls++ % timestamps.length];
      },
    });
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with an empty log bucket", () => {
    mockMathRandom([0.123]);
    mockDateNow([1622547600000]);

    const storage = new LogStorage();
    expect(storage.getLogCount()).toBe(0);
    expect(storage.getLogBucketByteSize()).toBe(0);
  });

  it("should add log item and increase the size and count correctly", () => {
    mockMathRandom([0.123]);
    mockDateNow([1622547600000]);

    const storage = new LogStorage();
    const logItem: HTTPLogItem = { message: "Test log message" };

    storage.addLog(logItem, 100); // Assuming 100 bytes for simplicity

    expect(storage.getLogCount()).toBe(1);
    expect(storage.getLogBucketByteSize()).toBe(100);
  });

  it("should finish a log batch and create a new empty bucket", () => {
    mockMathRandom([0.123, 0.456]); // Ensure different buckets
    mockDateNow([1622547600000, 1622547600000]);

    const storage = new LogStorage();
    const logItem: HTTPLogItem = { message: "Test log message" };
    storage.addLog(logItem, 100); // Adding an item to the current bucket

    const finishedBatch = storage.finishLogBatch();

    expect(finishedBatch).toEqual([logItem]); // The finished batch should contain the log item
    expect(storage.getLogCount()).toBe(0); // A new bucket should be empty
    expect(storage.getLogBucketByteSize()).toBe(0); // A new bucket should have a size of 0
  });

  it("should replace the current log bucket when creating a new one", () => {
    mockMathRandom([0.123, 0.456]); // Different values to ensure bucket change
    mockDateNow([1622547600000, 1622547601000]); // Different timestamps

    const storage = new LogStorage();
    const firstBucketPointer = storage.currentBucket;

    storage.finishLogBatch(); // Finishes the current batch and creates a new one
    expect(storage.currentBucket).not.toBe(firstBucketPointer);
  });
});
