import { vi, describe, it, expect, beforeEach } from "vitest";
import { DataDogTransport, type DDTransportOptions } from "datadog-transport-common";
import { convertLevel } from "../src/convert-level";
import buildTransport from "../src/index";

vi.mock("pino-abstract-transport", () => ({
  default: vi.fn().mockImplementation((processLogs) => processLogs),
}));

vi.mock("datadog-transport-common", () => ({
  DataDogTransport: vi.fn().mockImplementation(() => ({
    processLog: vi.fn(),
  })),
}));

vi.mock("../src/convert-level", () => ({
  convertLevel: vi.fn().mockReturnValue("debug"),
}));

const baseOptions: DDTransportOptions = {
  ddClientConf: {
    authMethods: {
      apiKeyAuth: "YOUR_API_KEY",
    },
  },
  onDebug: vi.fn(),
};

describe("DataDog transport", () => {
  const processLogSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore: Don't need to mock any other items
    vi.mocked(DataDogTransport).mockImplementation(() => ({
      processLog: processLogSpy,
    }));
  });

  it("should process logs correctly", async () => {
    const transport = buildTransport(baseOptions);
    const source = async function* () {
      yield { level: 10, time: "2023-01-01", msg: "test log" };
    };

    await transport(source());

    expect(DataDogTransport.mock.calls.length).toBe(1);
    expect(DataDogTransport.mock.calls[0][0]).toEqual(baseOptions);
    expect(convertLevel).toHaveBeenCalledWith(10);
    expect(processLogSpy).toHaveBeenCalledWith({
      level: "debug",
      date: "2023-01-01",
      msg: "test log",
    });
  });

  it("should call onDebug if log source object is empty", async () => {
    const onDebug = vi.fn();
    const mockOptions = { ...baseOptions, onDebug };
    const transport = buildTransport(mockOptions);
    const source = async function* () {
      yield null;
    };

    await transport(source());

    expect(onDebug).toHaveBeenCalledWith("Log source object is empty");
  });
});
