Calendar.ns('Views').Day = (function() {
  'use strict';

  var Parent = Calendar.Views.TimeParent;

  function Day() {
    Parent.apply(this, arguments);
  }

  Day.prototype = {
    __proto__: Parent.prototype,
    panThreshold: 50,
    childThreshold: 3,

    scale: 'day',

    childClass: Calendar.Views.DayChild,

    selectors: {
      element: '#day-view'
    },

    _initEvents: function() {
      Parent.prototype._initEvents.call(this);

      var delegateParent = this.delegateParent || this.frameContainer;
      this.delegate(
        delegateParent, 'click', '[data-id]', function(e, target) {
          Calendar.App.router.show('/event/show/' + target.dataset.id + '/');
        }
      );
    },

    handleEvent: function(e) {
      Parent.prototype.handleEvent.apply(
        this, arguments
      );

      switch (e.type) {
        case 'dayChange':
          this.app.timeController.selectedDay = this.app.timeController.day;
          /* falls through */
        case 'selectedDayChange':
          this._scrollDayEventsWrapperOnlyForToday(e.data[0]);
          break;
      }
    },

    _nextTime: function(time) {
      return new Date(
        time.getFullYear(),
        time.getMonth(),
        time.getDate() + 1
      );
    },

    _previousTime: function(time) {
      return new Date(
        time.getFullYear(),
        time.getMonth(),
        time.getDate() - 1
      );
    },

    render: function() {
      this._scrollDayEventsWrapper(
        this.app.timeController.day
      );
    },

    oninactive: function() {
      Parent.prototype.oninactive.apply(this, arguments);

      /**
       * We disable events here because this view
       * does not need to be updated while hidden
       * notice this will not effect the day children
       * at all...
       */
      var controller = this.app.timeController;
      controller.removeEventListener('dayChange', this);
      controller.removeEventListener('selectedDayChange', this);
    },

    onactive: function() {
      Parent.prototype.onactive.apply(this, arguments);
      /**
       * We only want to listen to views when
       * this view is actually active...
       */
      var controller = this.app.timeController;
      controller.on('dayChange', this);
      controller.on('selectedDayChange', this);

      controller.moveToMostRecentDay();
      this._scrollDayEventsWrapper(controller.position);

      if (!this.frames || !this.frames.length) {
        console.error('(Calendar: render error) no child frames');
        console.trace();
      }
    },

    _scrollDayEventsWrapper: function(date) {
      var scrollTo = 0;
      var now = new Date();

      if (Calendar.Calc.isSameDate(date, now)) {
        scrollTo = this._getHourScrollTop(now.getHours() - 1);
      } else {
        scrollTo = this._getHourScrollTop(8);
      }
      this.changeDate(date, {
        scrollTop: scrollTo,
        animated: true
      });
    },

    _scrollDayEventsWrapperOnlyForToday: function(date) {
      var now = new Date();

      this.changeDate(date);
      if (Calendar.Calc.isSameDate(date, now)) {
        this.changeDate(date, {
          scrollTop: this._getHourScrollTop(now.getHours() - 1),
          animated: true
        });
      }
    },

    _getHourScrollTop: function(hour) {
      if (hour >= 0 && hour <= 23) {
        // 50 is the height of a hour element
        // in the day-events-wrapper element.
        return hour * 50;
      } else {
        return 0;
      }
    }
  };

  Day.prototype.onfirstseen = Day.prototype.render;

  return Day;

}());
