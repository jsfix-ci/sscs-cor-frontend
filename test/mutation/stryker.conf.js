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
          'app/**',
          'test/unit/**',
          'test/chai-sinon.ts',
          'config/*.json'
        ],
    testFramework: 'mocha',
    testRunner: 'mocha',
    mutate:
      [
        'app/server/controllers/additional-evidence.ts',
        '!test/unit/controllers/additional-evidence.ts'
      ],
    maxConcurrentTestRunners: 2,
    coverageAnalysis: 'perTest',
    htmlReporter: { baseDir: 'functional-output/mutation-test' },
    tsconfigFile: 'app/server/tsconfig.json',
    mochaOptions: {
      spec:
        ['test/unit/controllers/additional-evidence.test.ts'],
      timeout: 8000
    },
    logLevel: 'debug'
  });
};

module.exports = strykerConfiguration;