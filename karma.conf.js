'use strict';

module.exports = function(config) {
  config.set({
    files: [
      'setup.js',
      'apps/video/js/video_utils.js',
      'apps/video/test/unit/video_utils_test.js'
    ],
    frameworks: ['mocha', 'chai-sinon'],
    client: {
      mocha: {
        ui: 'tdd'
      }
    },
    reporters: ['mocha'],
    browsers: ['FirefoxNightly'],
    autoWatch: true,
    singleRun: false
  });
};
