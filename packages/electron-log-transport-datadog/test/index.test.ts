import { DataDogTransport } from "datadog-transport-common";
import type { LogMessage } from "electron-log";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { dataDogTransport } from "../src";
import type { ElectronLogTransportOpts } from "../src/types";

vi.mock("datadog-transport-common", () => ({
  DataDogTransport: vi.fn().mockImplementation(() => ({
    processLog: vi.fn(),
  })),
}));

const LogMessageMock: LogMessage = {
  date: new Date(),
  level: "info",
  data: [],
};

const baseOptions: ElectronLogTransportOpts = {
  ddClientConf: {
    authMethods: {
      apiKeyAuth: "YOUR_API_KEY",
    },
  },
};

describe("dataDogTransport", () => {
  const processLogSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore: Don't need to mock any other items
    vi.mocked(DataDogTransport).mockImplementation(() => ({
      processLog: processLogSpy,
    }));
  });

  it("sends simple string log", () => {
    const transport = dataDogTransport(baseOptions);
    const logMessage = { ...LogMessageMock, data: ["test log"] };

    transport(logMessage);

    expect(processLogSpy).toHaveBeenCalledWith({
      date: logMessage.date.getTime(),
      level: logMessage.level,
      message: "test log",
    });
  });

  it("attaches metadata object", () => {
    const options = { ...baseOptions, metadataField: "meta" };
    const transport = dataDogTransport(options);
    const logMessage = { ...LogMessageMock, data: ["log with metadata", { user: "john doe" }] };

    transport(logMessage);

    const expectedData = {
      date: logMessage.date.getTime(),
      level: logMessage.level,
      message: "log with metadata",
      meta: { user: "john doe" },
    };

    expect(processLogSpy).toHaveBeenCalledWith(expectedData);
  });

  it("handles array data correctly", () => {
    const options = { ...baseOptions, arrayDataField: "details" };
    const transport = dataDogTransport(options);
    const logMessage = { ...LogMessageMock, data: ["log with array", [1, 2, 3]] };

    transport(logMessage);

    const expectedData = {
      date: logMessage.date.getTime(),
      level: logMessage.level,
      message: "log with array",
      details: [1, 2, 3],
    };

    expect(processLogSpy).toHaveBeenCalledWith(expectedData);
  });
});
