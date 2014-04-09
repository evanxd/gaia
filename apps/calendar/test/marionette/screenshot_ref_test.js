'use strict';

var Calendar = require('./lib/calendar'),
    assert = require('chai').assert,
    fs = require('fs');

marionette('screenshot reference test', function() {
  var client = marionette.client(),
      app = null;

  setup(function() {
    app = new Calendar(client);
    app.launch({ hideSwipeHint: true });
  });

  test('should have correct UI for launch time', function() {
    var expectedMonthView =
          fs.readFileSync(__dirname + '/images/travis/month_view.html', 'utf8'),
        monthView = client.screenshot();

    console.log('monthView: ' + monthView);
    assert.ok(expectedMonthView.indexOf(monthView) !== -1);
  });
});
