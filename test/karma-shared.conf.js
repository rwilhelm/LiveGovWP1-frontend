module.exports = function() {
  return {
    basePath: '../',
    frameworks: ['mocha'],
    reporters: ['progress', 'coverage'],
    browsers: ['PhantomJS'],
    autoWatch: true,
    singleRun: false,
    colors: true,

    files : [
      //3rd Party Code
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-route/angular-route.js',
      'public/bower_components/angular-resource/angular-resource.js',
      'public/bower_components/angular-mocks/angular-mocks.js',

      //App-specific Code
      'public/js/modules.js',
			'public/js/services.js',
			'public/js/directives.js',
			'public/js/controllers.js',
			'public/js/filters.js',
			'public/js/routes.js',
			'public/js/helpers.js',

      //Test-Specific Code
      'node_modules/chai/chai.js',
      'test/**/*.spec.js'
    ],

    // preprocessors: {
    //   // source files, that you wanna generate coverage for
    //   // do not include tests or libraries
    //   // (these files will be instrumented by Istanbul)
    //   'src/*.js': ['coverage']
    // },

    // optionally, configure the reporter
    // coverageReporter: {
    //   type : 'html',
    //   dir : 'coverage/'
    // },

    // plugins : [
      // 'karma-coverage',
    //   'karma-mocha',
    //   // 'karma-spec-reporter',
    //   // 'karma-unicorn-reporter',
    //   // 'karma-nyan-reporter',
    //   'karma-chrome-launcher',
    //   'karma-firefox-launcher',
    //   'karma-phantomjs-launcher',
    // ],

    // preprocessors : {
    //   //    '**/client/js/*.js': 'coverage'
    // },

    // reportSlowerThan : 500,
    // captureTimeout : 10000,
    // logLevel : config.LOG_DEBUG

  };
};

