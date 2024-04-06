import { DataDogTransport } from "datadog-transport-common";
import type { LogMessage } from "electron-log";
import type { ElectronLogTransportOpts } from "./types";

export function dataDogTransport(options: ElectronLogTransportOpts) {
  options.service = options.service ?? "Electron";
  const transport = new DataDogTransport(options);

  return function processLogs(message: LogMessage) {
    // Split the data into the message and metadata
    let msg = "";
    let metadata = {};
    let arrayData: any[] = [];

    for (const data of message.data) {
      if (typeof data === "string") {
        msg = msg + data;
        continue;
      }

      if (Array.isArray(data)) {
        arrayData = arrayData.concat(data);
        continue;
      }

      if (typeof data === "object") {
        metadata = {
          ...metadata,
          ...data,
        };
      }
    }

    let item: Record<string, any> = {
      date: message.date.getTime(),
      level: message.level,
      message: msg,
    };

    if (Object.keys(metadata).length) {
      if (options.metadataField) {
        item[options.metadataField] = metadata;
      } else {
        item = {
          ...item,
          ...metadata,
        };
      }
    }

    if (arrayData.length) {
      if (options.arrayDataField) {
        item[options.arrayDataField] = arrayData;
      } else {
        item.arrayData = arrayData;
      }
    }

    transport.processLog(item);
  };
}
