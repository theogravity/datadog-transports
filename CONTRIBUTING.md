# Contributing

# Install

```bash
# Install pnpm
corepack enable
corepack prepare pnpm@latest --activate

# Install dependencies
pnpm i

# Run tests
pnpm test

# Build
pnpm build

# Lint
pnpm lint
```

# Submitting PRs

## General rules

- Make sure to add tests for any code written. They are written using [`vitest`](https://vitest.dev/). The tests should pass before submitting a PR.
- Make sure to run the linter before submitting a PR. The linter is run using `pnpm lint`. It uses
  [biome.js](https://biomejs.dev/) for linting.
- The PR must pass the CI checks before it can be merged. This means it should pass linting and tests.
