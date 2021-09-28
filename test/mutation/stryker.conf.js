const strykerConfiguration = config => {
  config.set({
    mutator: 'typescript',
    transpilers: ['typescript'],
    tempDirName: 'strykerTmp',
    reporters:
      [
        'clear-text',
        'progress',
        'html'
      ],
    files:
        [
          'app/server/services/*.ts',
          'app/server/services/request-wrapper.ts',
          'test/unit/services/*.test.ts',
          'test/chai-sinon.ts',
          'test/fixtures/evidence/evidence.txt',
          'config/*.json',
          'app/server/paths.ts'
        ],
    testFramework: 'mocha',
    testRunner: 'mocha',
    mutate:
      [
        'app/server/services/*.ts',
        '!test/unit/services/*.test.ts'
      ],
    maxConcurrentTestRunners: 2,
    coverageAnalysis: 'perTest',
    htmlReporter: { baseDir: 'functional-output/mutation-test' },
    tsconfigFile: 'app/server/tsconfig.json',
    mochaOptions: {
      spec:
        ['test/unit/services/*.test.ts'],
      timeout: 8000
    },
    logLevel: 'debug'
  });
};

module.exports = strykerConfiguration;