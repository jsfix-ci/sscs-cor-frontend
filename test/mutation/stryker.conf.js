const strykerConfiguration = config => {
  config.set({
    mutator: 'typescript',
    transpilers: ['typescript'],
    reporters:
      [
        'clear-text',
        'progress',
        'html'
      ],
    files:
        [
          'app/server/controllers/*.ts',
          'app/server/utils/featureEnabled.ts'
        ],
    testFramework: 'mocha',
    testRunner: 'mocha',
    mutate:
      [
        'app/server/controllers/*.ts',
        '!test/unit/controllers/*.test.ts'
      ],
    maxConcurrentTestRunners: 2,
    coverageAnalysis: 'perTest',
    htmlReporter: { baseDir: 'functional-output/mutation-test' },
    tsconfigFile: 'app/server/tsconfig.json',
    mochaOptions: {
      spec:
        ['test/unit/controllers/*.test.ts'],
      timeout: 8000
    },
    logLevel: 'debug'
  });
};

module.exports = strykerConfiguration;