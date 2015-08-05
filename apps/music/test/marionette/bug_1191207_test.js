/* global require, marionette, setup, suite, test, __dirname */
'use strict';

var assert = require('assert');
var Music = require('./lib/music.js');
var FakeRingtones = require('./lib/fakeringtones.js');
var FakeControls = require('./lib/fakecontrols.js');
var Statusbar = require('./lib/statusbar.js');

marionette('Music player tests', function() {
  var apps = {};
  apps[FakeRingtones.DEFAULT_ORIGIN] = __dirname + '/fakeringtones';
  apps[FakeControls.DEFAULT_ORIGIN] = __dirname + '/fakecontrols';

  var client = marionette.client({
    profile: {
      prefs: {
        'device.storage.enabled': true,
        'device.storage.testing': true,
        'device.storage.prompt.testing': true
      },

      apps: apps
    }
  });

  var music;

  setup(function() {
    music = new Music(client);

    client.fileManager.removeAllFiles();
    client.fileManager.add([
      // Album = 'A Minute With Brendan'
      // Artist = 'Minute With'
      // Title = 'Boot To Gecko (B2G)'
      { type: 'music', filePath: 'test_media/samples/Music/b2g.ogg' }
    ]);
  });

  suite('Status bar', function() {

    var statusbar;
    setup(function() {
      statusbar = new Statusbar(client);
    });

    test('Check the play icon is in the status bar. moztrap:9742', function() {
      music.launch();
      music.waitForFirstTile();
      music.switchToSongsView();

      // check the status bar for the hidden play icon
      client.switchToFrame();
      assert.equal(statusbar.playingIndicator.getAttribute('hidden'), 'true');

      music.switchToMe();
      music.playFirstSong();
      music.waitForPlayerView();

      // check the status bar
      client.switchToFrame();
      assert.equal(statusbar.playingIndicator.getAttribute('hidden'), 'false');

      // switch to the homescreen
      var system = client.loader.getAppClass('system');
      system.goHome();
      client.waitFor(function() {
        return client.findElement(system.Selector.activeHomescreenFrame)
          .displayed();
      });

      // check the status bar again
      assert.equal(statusbar.playingIndicator.getAttribute('hidden'), 'false');
    });
  });
});
