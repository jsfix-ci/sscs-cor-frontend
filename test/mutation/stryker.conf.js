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
          'app/server/controllers/policies.ts',
          'test/unit/controllers/policies.test.ts',
          'test/chai-sinon.ts',
          'config/*.json',
          'app/server/paths.ts'
        ],
    testFramework: 'mocha',
    testRunner: 'mocha',
    mutate:
      [
        'app/server/controllers/policies.ts',
        '!test/unit/controllers/policies.ts'
      ],
    maxConcurrentTestRunners: 2,
    coverageAnalysis: 'perTest',
    htmlReporter: { baseDir: 'functional-output/mutation-test' },
    tsconfigFile: 'app/server/tsconfig.json',
    mochaOptions: {
      spec:
        ['test/unit/controllers/policies.test.ts'],
      timeout: 8000
    },
    logLevel: 'debug'
  });
};

module.exports = strykerConfiguration;