import { beforeEach, describe, expect, it, vi } from "vitest";
import * as datadogApiClient from "@datadog/datadog-api-client";
import pRetry from "../src/vendor/p-retry";
import * as exitHook from "../src/vendor/exit-hook";
import { type LogStorage, DataDogTransport } from "../src";

vi.mock("@datadog/datadog-api-client", () => ({
  client: {
    createConfiguration: vi.fn(() => ({
      // Ensure this mock object includes all methods called within your class
      setServerVariables: vi.fn(),
    })),
  },
  v2: {
    LogsApi: vi.fn(() => ({
      submitLog: vi.fn(() => Promise.resolve()),
    })),
  },
}));

vi.mock("../src/vendor/p-retry", () => ({
  default: vi.fn((fn) => fn()),
}));

vi.mock("../src/vendor/exit-hook", () => ({
  default: vi.fn((callback) => callback()),
}));

vi.mock("../src/LogStorage", () => ({
  LogStorage: vi.fn(() => ({
    addLog: vi.fn(),
    finishLogBatch: vi.fn(() => []),
    getLogCount: vi.fn(() => 1),
    getLogBucketByteSize: vi.fn(() => 0),
    currentBucket: "testBucket",
  })),
}));

describe("DataDogTransport", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("#constructor", () => {
    it("initializes the API instance and configures the send interval and exit hook", () => {
      const spySetInterval = vi.spyOn(global, "setInterval");
      new DataDogTransport({
        ddClientConf: {},
        sendImmediate: false,
      });
      expect(datadogApiClient.client.createConfiguration).toHaveBeenCalled();
      expect(spySetInterval).toHaveBeenCalled();
      // @ts-ignore
      expect(exitHook.default).toHaveBeenCalled();
    });
  });

  describe("#processLog", () => {
    it("queues the log for sending later", () => {
      const transport = new DataDogTransport({
        ddClientConf: {},
        sendImmediate: false,
      });
      const logItem = { message: "{}" };
      transport.processLog(logItem);

      const logStorage: LogStorage = transport["logStorage"];

      expect(logStorage.addLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: JSON.stringify(logItem),
        }),
        expect.any(Number),
      );
    });

    it("sends the log immediately", async () => {
      const transport = new DataDogTransport({
        ddClientConf: {},
        sendImmediate: true,
      });

      const mockSubmitLog = vi.fn();
      transport["apiInstance"].submitLog = mockSubmitLog;

      const logItem = { message: "{}" };
      await transport.processLog(logItem);

      expect(mockSubmitLog).toHaveBeenCalledTimes(1);
    });
  });

  describe("#sendLogs", () => {
    it("sends logs using the Datadog API client", async () => {
      const transport = new DataDogTransport({
        ddClientConf: {},
        sendImmediate: false,
      });

      const mockSubmitLog = vi.fn();
      transport["apiInstance"].submitLog = mockSubmitLog;

      transport["sendLogs"]({
        logsToSend: [{ message: "Log message" }],
        bucketName: "bucketName",
      });

      expect(pRetry).toHaveBeenCalled();
    });
  });
});
