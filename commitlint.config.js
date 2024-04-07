module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always',
      [
        'all',
        'datadog-transport-common',
        'electron-log-transport-datadog',
        'pino-datadog-transport'
      ]],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'style',
        'refactor',
        'ci',
        'test',
        'revert',
        'perf'
      ],
    ],
  },
};
