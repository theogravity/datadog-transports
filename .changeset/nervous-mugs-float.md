---
"electron-log-transport-datadog": major
"pino-datadog-transport": major
"datadog-transport-common": minor
---

The core logic for `electron-log-transport-datadog` and `pino-datadog-transport`
has been split into the `datadog-transport-common` package.

- The `p-retry` and `exit-hook` libs are now updated to current
- If `sendImmediate` is enabled, we will no longer enable the exit hook to send
  off any pending logs (since sending is immediate)

The changes should be transparent, but we're releasing these
packages under a new major version just in case.
