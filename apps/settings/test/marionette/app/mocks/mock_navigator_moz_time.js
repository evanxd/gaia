Components.utils.import('resource://gre/modules/Services.jsm');

Services.obs.addObserver(function(document) {

  if (!document || !document.location)
    return;

  var window = document.defaultView.wrappedJSObject;
  var time = new Date();
  window.navigator.__defineGetter__('mozTime', function() {
    return {
      __exposedProps__: {
        get: 'r',
        set: 'r'
      },
      get: function() {
        dump('evanxd: mozTime.get()');
        return time;
      },
      set: function(t) {
        dump('evanxd: mozTime.set()');
        time = t;
      }
    };
  });
}, 'document-element-inserted', false);
