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
          'app/server/services/*.ts',
          'app/server/middleware/*.ts',
          'app/server/utils/*.ts',
          'app/server/utils/featureEnabled.ts'
        ],
    testFramework: 'mocha',
    testRunner: 'mocha',
    mutate:
      [
        'app/server/controllers/*.ts',
        'app/server/services/*.ts',
        'app/server/middleware/*.ts',
        'app/server/utils/*.ts',
        '!test/unit/controllers/*.test.ts',
        '!test/unit/services/*.test.ts',
        '!test/unit/middleware/*.test.ts',
        '!test/unit/utils/*.test.ts'
      ],
    maxConcurrentTestRunners: 2,
    coverageAnalysis: 'perTest',
    htmlReporter: { baseDir: 'functional-output/mutation-test' },
    tsconfigFile: 'app/server/tsconfig.json',
    mochaOptions: {
      spec:
        [
          'test/unit/controllers/*.test.ts',
          'test/unit/services/*.test.ts',
          'test/unit/middleware/*.test.ts',
          'test/unit/utils/*.test.ts'
        ],
      timeout: 8000
    },
    logLevel: 'debug'
  });
};

module.exports = strykerConfiguration;