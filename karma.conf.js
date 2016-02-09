// Karma configuration
// Generated on Wed Jan 20 2016 19:29:14 GMT-0600 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      // angular source
      'client/lib/angular/angular.js',
      'client/lib/angular-ui-router/release/angular-ui-router.js',
      'client/lib/angular-mocks/angular-mocks.js',

      // our client-side app code
      'client/app.js',
      'client/app/**/*.js',

      // our client-side and general spec files
      'specs/*.js',
      'specs/client/**/*.js',

      //lodash
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.3.0/lodash.js'

    ],


    // list of files to exclude
    exclude: [
        'karma.conf.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],

    client: {
      captureConsole: false
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS', 'Chrome','Chrome_travis_ci'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,


    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
