'use strict';

marionette('suiteSetup test', function() {
  var client = marionette.client();

  suiteSetup(function() {
    console.log('client.apps: ' + typeof client.apps);
  });

  test('test', function() {
    return true;
  });
});
