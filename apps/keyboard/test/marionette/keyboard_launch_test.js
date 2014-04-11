'use strict';

var KeyboardTests = require('./lib/keyboard_tests'),
    assert = require('assert');

var KEYBOARD_ORIGIN = 'app://keyboard.gaiamobile.org';

marionette('launch Keyboard app', function() {
  var apps = {},
      keyboardtests = null,
      client = null;

  apps[KeyboardTests.ORIGIN] = __dirname + '/keyboardtests';
  client = marionette.client({
    apps: apps,
    prefs: {
      'focusmanager.testmode': true
    }
  });

  setup(function() {
    keyboardtests = new KeyboardTests(client);
    keyboardtests.launch();
  });

  test('should show lowercase layout', function() {
    var keyboard = null;

    keyboardtests.textInput.click();
    // Switch to System app.
    client.switchToFrame();
    client.apps.switchToApp(KEYBOARD_ORIGIN);

    keyboard = client.findElement('#keyboard');
    client.waitFor(function() {
      if (keyboard.displayed()) {
        assert.ok(true);
        return true;
      }
    });
  });
});
