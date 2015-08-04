/* global AudioChannelController */
/* global BaseModule */
'use strict';

(function() {
  /**
   * SystemWindow is a placeholder for the system app's mozbrowser iframe
   * but with no actual UI.
   * We will use mozChromeEvent/mozContentEvent to communicate with shell.js
   * to use the actual mozbrowser iframe of the system app.
   */
  var SystemWindow = function() {
    // Send the event later becuase of Bug 1167465.
    setTimeout(() => {
      this._sendContentEvent({ type: 'system-audiochannel-list' });
    });
  };

  SystemWindow.STATES = [
    'getAudioChannels'
  ];

  SystemWindow.EVENTS = [
    'mozSystemWindowChromeEvent'
  ];

  BaseModule.create(SystemWindow, {
    name: 'SystemWindow',
    EVENT_PREFIX: 'systemwindow',
    DEBUG: false,
    // The fake app window ID of System app.
    instanceID: null,
    // The audio channels belong to System app.
    audioChannels: null,
    // Know an AppWindow object is for System app or other apps. 
    isSystem: true,

    /**
     * Initial the module.
     */
    _start: function() {
      this.instanceID = 'systemAppID';
      this.audioChannels = new Map();
    },

    /**
     * Handle mozSystemWindowChromeEvent event.
     *
     * @param {Event} evt The event to handle.
     */
    _handle_mozSystemWindowChromeEvent: function(evt) {
      var detail = evt.detail;
      switch (detail.type) {
        case 'system-audiochannel-list':
          console.log('Bug 1167465: get audio channels: ' +
            detail.audioChannels);
          detail.audioChannels.forEach((name) => {
            this.audioChannels.set(
              name, new AudioChannelController(this, { name: name })
            );
          });
          this.publish('audiochannelsregistered');
          break;
      }
    },

    getAudioChannels: function() {
      return this.audioChannels;
    },

    /**
     * Send MozContentEvent to control the audio chanenl in System app.
     *
     * @param {Object} detail The arguments for passing to Gecko.
     * @param {Object} detail.type The operation for the audio channel.
     */
    _sendContentEvent: function(detail) {
      var evt = new CustomEvent('mozContentEvent', { detail: detail });
      window.dispatchEvent(evt);
    }
  });
}());
