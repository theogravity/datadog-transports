module.exports = {
  dependencyTypes: ['dev', 'peer', 'prod'],
  semverRange: '^',
  source: ['package.json', 'packages/*/package.json'],
  "semverGroups": [
    {
      "range": "^",
      "dependencies": ["**"],
      "packages": ["**"]
    }
  ],
  versionGroups: [
    {
      label:
          'Internal config packages should be pinned to "*" (meaning any version is acceptable)',
      packages: ['**'],
      dependencies: ['tsconfig'],
      dependencyTypes: ['dev'],
      pinVersion: 'workspace:*',
    },
  ],
};