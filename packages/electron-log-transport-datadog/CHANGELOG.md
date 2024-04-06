# 2.0.1

Readme updates

# 2.0.0

**Breaking:**

- Removed the `metadata` field from the log entry format. The default is all object data is assigned to the root of the log entry.

Added:

- Added an option called `metadataField` to allow you to specify a field to assign all object data to. This is useful if you want to keep the root of the log entry clean.
- Added an option called `arrayDataField` to allow you to specify a field to assign all array data to. The default is `arrayData`.

# 1.1.0

Downgrade `p-retry` and `exit-hook` to enable CJS compatibility.