# datadog-transport-common

## 3.0.2

### Patch Changes

- [#12](https://github.com/theogravity/datadog-transports/pull/12) [`649129f`](https://github.com/theogravity/datadog-transports/commit/649129fae9e2777bae64b4f49a89d862f0b75f8a) Thanks [@theogravity](https://github.com/theogravity)! - Fix ERR_REQUIRE_ESM import error caused by is-network-error package by vendoring it.

## 3.0.1

### Patch Changes

- [#7](https://github.com/theogravity/datadog-transports/pull/7) [`8b1f73a`](https://github.com/theogravity/datadog-transports/commit/8b1f73ab5faec95459ab22a1dcb350997caf7c6c) Thanks [@theogravity](https://github.com/theogravity)! - fix: files not being published on release

## 3.0.0

### Minor Changes

- [`7381770`](https://github.com/theogravity/datadog-transports/commit/738177094e4e776c6ba554f738b6cd5f96e17c04) Thanks [@theogravity](https://github.com/theogravity)! - The core logic for `electron-log-transport-datadog` and `pino-datadog-transport`
  has been split into the `datadog-transport-common` package.

  - The `p-retry` and `exit-hook` libs are now updated to current
  - If `sendImmediate` is enabled, we will no longer enable the exit hook to send
    off any pending logs (since sending is immediate)

  The changes should be transparent, but we're releasing these
  packages under a new major version just in case.
