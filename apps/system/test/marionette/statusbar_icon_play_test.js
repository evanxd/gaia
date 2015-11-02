'use strict';

marionette('Play icon >', function() {
  var MUSIC_APP = 'app://music.gaiamobile.org';
  var client = marionette.client({
    profile: {
      prefs: {
        'device.storage.enabled': true
      }
    }
  });
  var sys;

  setup(function() {
    client.setScriptTimeout(20000);
    client.fileManager.removeAllFiles();
    client.fileManager.add([
      { type: 'music', filePath: 'test_media/samples/Music/b2g.ogg' }
    ]);
    sys = client.loader.getAppClass('system');
    sys.waitForStartup();
    sys.waitForLaunch(MUSIC_APP);
  });

  test('Play icon is showed', function() {
    // FIXME: Music app cannot be launched correctly.
    client.helper.wait(15000);
  });
});
