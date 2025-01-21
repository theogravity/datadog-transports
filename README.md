# Transports for Datadog

This is a monorepo containing the following packages:

- [`datadog-transport-common`](https://github.com/theogravity/datadog-transports/tree/main/packages/datadog-transport-common): A library for sending logs to datadog
- [`electron-log-transport-datadog`](https://github.com/theogravity/datadog-transports/tree/main/packages/electron-log-transport-datadog): Send logs to datadog using `electron-log`
- [`pino-datadog-transport`](https://github.com/theogravity/datadog-transports/tree/main/packages/pino-datadog-transport): Send logs to datadog using `pino`

You can find information for them in their respective packages via the `README.md` file.

## Recommended

It is recommended you use [LogLayer](https://loglayer.dev) if you need to ship logs to DataDog
as you can send logs to DataDog and use the logging library of your choice.

## Cloning / pulling this monorepo

This monorepo uses [`pnpm`](https://pnpm.io/) because [I couldn't
get workspaces to work properly](https://github.com/vercel/turbo/issues/7910#issuecomment-2041209008) under `npm` and `yarn`.
