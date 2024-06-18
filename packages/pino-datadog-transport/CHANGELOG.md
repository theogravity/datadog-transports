# pino-datadog-transport

## 3.0.4

### Patch Changes

- [`8fc5802`](https://github.com/theogravity/datadog-transports/commit/8fc5802b831e91e547c060e44afb257b61f0396d) Thanks [@theogravity](https://github.com/theogravity)! - Export type DDTransportOptions

## 3.0.3

### Patch Changes

- [#12](https://github.com/theogravity/datadog-transports/pull/12) [`649129f`](https://github.com/theogravity/datadog-transports/commit/649129fae9e2777bae64b4f49a89d862f0b75f8a) Thanks [@theogravity](https://github.com/theogravity)! - Fix ERR_REQUIRE_ESM import error caused by is-network-error package by vendoring it.

- Updated dependencies [[`649129f`](https://github.com/theogravity/datadog-transports/commit/649129fae9e2777bae64b4f49a89d862f0b75f8a)]:
  - datadog-transport-common@3.0.2

## 3.0.2

### Patch Changes

- [#7](https://github.com/theogravity/datadog-transports/pull/7) [`8b1f73a`](https://github.com/theogravity/datadog-transports/commit/8b1f73ab5faec95459ab22a1dcb350997caf7c6c) Thanks [@theogravity](https://github.com/theogravity)! - fix: files not being published on release

- Updated dependencies [[`8b1f73a`](https://github.com/theogravity/datadog-transports/commit/8b1f73ab5faec95459ab22a1dcb350997caf7c6c)]:
  - datadog-transport-common@3.0.1

## 3.0.1

### Patch Changes

- [`23c2b34`](https://github.com/theogravity/datadog-transports/commit/23c2b347b6e76f3696cb8a41efa2554c8a4d4aca) Thanks [@theogravity](https://github.com/theogravity)! - Remove stale badges from the readme

## 3.0.0

### Major Changes

- [`7381770`](https://github.com/theogravity/datadog-transports/commit/738177094e4e776c6ba554f738b6cd5f96e17c04) Thanks [@theogravity](https://github.com/theogravity)! - The core logic for `electron-log-transport-datadog` and `pino-datadog-transport`
  has been split into the `datadog-transport-common` package.

  - The `p-retry` and `exit-hook` libs are now updated to current
  - If `sendImmediate` is enabled, we will no longer enable the exit hook to send
    off any pending logs (since sending is immediate)

  The changes should be transparent, but we're releasing these
  packages under a new major version just in case.

### Patch Changes

- Updated dependencies [[`7381770`](https://github.com/theogravity/datadog-transports/commit/738177094e4e776c6ba554f738b6cd5f96e17c04)]:
  - datadog-transport-common@3.0.0

## 1.3.1 / 1.3.2 - Wed Nov 01 2023 22:55:38

(Had CI issues that published two versions but they are the same)

**Contributor:** Daniel Hochman

- fix `setServerVariables is deprecated` warning (#18)

## 1.3.0 - Wed Feb 22 2023 15:00:36

**Contributor:** ooga

- Fix level mapping (#13)

## 1.2.2 - Sun Aug 21 2022 20:19:45

**Contributor:** Theo Gravity

- Documentation updates (#9)

## 1.2.1 - Sun Aug 21 2022 09:23:30

**Contributor:** Theo Gravity

- Add Datadog region support and more debug messages (#8)

- A new config option called `ddServerConf` has been added to configure the server region
- Added `onInit` callback
- Added more debugging messages

## 1.1.4 - Fri Aug 19 2022 00:19:40

**Contributor:** Theo Gravity

- Attempt to fix memory leak (#7)

This changes the internal implementation of how we store logs for batches.

## 1.1.3 - Mon Aug 08 2022 00:35:00

**Contributor:** Theo Gravity

- Fix repeat sends (#4)

## 1.1.2 - Mon Aug 08 2022 00:04:42

**Contributor:** Theo Gravity

- Fix queue empty behavior (#3)

## 1.1.1 - Sun Aug 07 2022 22:19:48

**Contributor:** Theo Gravity

- Add batch sending, retry on send failure (#2)

## 1.0.5 - Sun Aug 07 2022 09:20:55

**Contributor:** Theo Gravity

- Update readme

## 1.0.4 - Sun Aug 07 2022 08:57:14

**Contributor:** Theo Gravity

- Fix CI
