'use strict';

var Calendar = require('./calendar');

marionette('transition', function() {
  var client = marionette.client(),
      app = null;

  setup(function() {
    app = new Calendar(client);
    app.launch({ hideSwipeHint: true });
  });

  test('transition end test', function() {
    client.helper.wait(2000000);
  });
});
