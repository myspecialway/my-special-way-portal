const path = require('path');
module.exports = function(config) {
    config.set({
        reporter: ['progress', 'clear-text', 'dots', 'html', 'event-recorder'],
        coverageAnalysis: 'off', // Coverage analysis with a transpiler is not supported a.t.m.
        tsconfigFile: 'tsconfig.json', // Location of your tsconfig.json file
        mutator: 'typescript', // Specify that you want to mutate typescript code
        testRunner: 'jest',
        transpilers: [
            //'typescript', // Specify that your typescript code needs to be transpiled before tests can be run. Not needed if you're using ts-node Just-in-time compilation.
           // 'webpack',
        ],
      mutate: ["src/**/*.ts", "!src/**/*.spec.ts","!src/**/*.mock.ts","!src/mocks/**/*.ts","!src/environments/**/*.ts"],
      jest: {
            project: 'default',
      }
    });
  };