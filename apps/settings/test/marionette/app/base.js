'use strict';
/**
 * Base app object to provide common methods to app objects
 * @constructor
 * @param {Marionette.Client} client for operations.
 */
function Base(client, origin, selectors) {
  this.client = client;
  this.origin = origin;
  this.selectors = selectors;
}

module.exports = Base;

Base.prototype = {
  URL: 'app://settings.gaiamobile.org',
  /**
   * Launches settings app, switches to frame, and waits for it to be loaded.
   */
  launch: function() {
    this.client.apps.launch(this.origin);
    this.client.apps.switchToApp(this.origin);
    this.client.helper.waitForElement('body');
  },

  /**
   * @protected
   * @param {String} name of selector [its a key in Settings.Selectors].
   */
  findElement: function(name) {
    return this.client.findElement(this.selectors[name]);
  },

  /**
   * @protected
   * @param {String} name of selector [its a key in Settings.Selectors].
   */
  findElements: function(name) {
    return this.client.findElements(this.selectors[name]);
  },

  /**
   * @protected
   * @param {String} name of selector [its a key in Settings.Selectors].
   */
  waitForElement: function(name) {
    return this.client.helper.waitForElement(this.selectors[name]);
  },

  /**
   * Go to system app scope
   */
  switchToSystem: function() {
    this.client.switchToFrame();
  },

  /**
   * Go to settings app scope
   */
  backToApp: function() {
    this.switchToSystem();
    this.client.apps.switchToApp(this.URL);
  },

  /**
   * Enable value selector of system app, and choose |name|
   * @param {String} name of the choosing item
   */
  valueSelect: function(name) {
    this.switchToSystem();
    var list = this.client.helper.waitForElement('#value-selector-container');
    this.client.waitFor(function() {
      return list.getAttribute('hidden') === true;
    });
    var items = this.client.helper.waitForElement(
      '#value-selector-container ol li');
    this.client.waitFor(function() {
      return items.length > 0;
    });

    var item;
    for (var i = 0; i < items.length; i++) {
      item = items[i];
      if (item.findElement('span').text() === name) {
        break;
      }
    }
    return item;
  }
};
