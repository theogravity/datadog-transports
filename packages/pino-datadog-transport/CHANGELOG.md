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
