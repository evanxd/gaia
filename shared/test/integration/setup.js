// all tests need app support
marionette.plugin('apps', require('marionette-apps'));
marionette.plugin('helper', require('marionette-helper'));
marionette.plugin('contentScript', require('marionette-content-script'));
marionette.plugin('debug',
                  require('marionette-debug'),
                  { server: 'localhost', port: 3000 });
