Components.utils.import('resource://gre/modules/Services.jsm');

Services.obs.addObserver(function(document) {

  if (!document || !document.location)
    return;

  var window = document.defaultView.wrappedJSObject;
  var time = new Date();
  window.navigator.__defineGetter__('mozTime', function() {
    return {
      get: function() {
        return time;
      },
      set: function(t) {
        time = t;
      }
    };
  });
}, 'document-element-inserted', false);
