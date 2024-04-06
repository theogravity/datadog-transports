import type { DDTransportOptions } from "datadog-transport-common";

export interface ElectronLogTransportOpts extends DDTransportOptions {
  /**
   * Set to assign a field to store all metadata in the log object that is sent to datadog.
   */
  metadataField?: string;
  /**
   * Set to re-assign the field that stores all array metadata in the log object that is sent to datadog.
   * Default is "arrayData".
   */
  arrayDataField?: string;
}
