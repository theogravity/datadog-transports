import build from "pino-abstract-transport";
import { DataDogTransport, type DDTransportOptions } from "datadog-transport-common";
import { convertLevel } from "./convert-level";

export default (options: DDTransportOptions) => {
  const transport = new DataDogTransport(options);

  return build(async function processLogs(source) {
    for await (const obj of source) {
      if (!obj) {
        if (options.onDebug) {
          options.onDebug("Log source object is empty");
        }

        return;
      }

      // Datadog uses the date field for timestamp
      obj.date = obj.time;
      delete obj.time;

      transport.processLog({
        ...obj,
        level: convertLevel(obj.level),
      });
    }
  });
};
