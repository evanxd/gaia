'use strict';

module.exports = function(config) {
  config.set({
    files: [
      'apps/video/js/video_utils.js',
      'apps/video/test/unit/video_utils_test.js'
    ],
    frameworks: ['mocha', 'chai-sinon', 'test-agent'],
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
