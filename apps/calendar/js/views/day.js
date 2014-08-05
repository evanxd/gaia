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
      var date;
      Parent.prototype.handleEvent.apply(
        this, arguments
      );

      switch (e.type) {
        case 'dayChange':
          this.app.timeController.selectedDay = this.app.timeController.day;
          /* falls through */
        case 'selectedDayChange':
          date = e.data[0];
          this.changeDate(date, {
            scrollToHour: this._dateToScroll(date, { onlyToday: true }),
          });
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
      var date = this.app.timeController.day;
      this.changeDate(date, {
        scrollToHour: this._dateToScroll(date)
      });
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
      var date = controller.position;
      this.changeDate(date, {
        scrollToHour: this._dateToScroll(date)
      });

      if (!this.frames || !this.frames.length) {
        console.error('(Calendar: render error) no child frames');
        console.trace();
      }
    },

    _dateToScroll: function(date, options) {
      var now = new Date();
      var onlyToday = false;
      var hour;

      if (options) {
        onlyToday = options.onlyToday || onlyToday;
      }

      if (Calendar.Calc.isSameDate(date, now)) {
        hour = now.getHours() - 1;
      } else if (!onlyToday) {
        hour = 8;
      }

      return hour;
    }
  };

  Day.prototype.onfirstseen = Day.prototype.render;

  return Day;

}());
