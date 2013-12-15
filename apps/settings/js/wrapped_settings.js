require.config({
  shim: {
    settings: {
      exports: 'Settings'
    }
  }
});

define(function(require, exports, module) {
  var settings = require('settings');
  return settings;
});
