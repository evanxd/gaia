'use strict';

var KeyboardTests = require('./lib/keyboard_tests');

var KEYBOARD_ORIGIN = 'app://keyboard.gaiamobile.org';

marionette('Keyboard APP', function() {
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
    keyboardtests.textInput.click();
  });

  test('should show lowercase layout', function() {
    // switch to System app
    client.switchToFrame();
    client.apps.switchToApp(KEYBOARD_ORIGIN);

    // Capture and print screenshot of Keyboard app.
    console.log('Screenshot: data:image/png;base64,' + client.screenshot());
  });
});
