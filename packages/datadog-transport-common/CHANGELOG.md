# datadog-transport-common

## 3.0.0

### Minor Changes

- [`7381770`](https://github.com/theogravity/datadog-transports/commit/738177094e4e776c6ba554f738b6cd5f96e17c04) Thanks [@theogravity](https://github.com/theogravity)! - The core logic for `electron-log-transport-datadog` and `pino-datadog-transport`
  has been split into the `datadog-transport-common` package.

  - The `p-retry` and `exit-hook` libs are now updated to current
  - If `sendImmediate` is enabled, we will no longer enable the exit hook to send
    off any pending logs (since sending is immediate)

  The changes should be transparent, but we're releasing these
  packages under a new major version just in case.
