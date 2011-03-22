var Second = OpenLayers.Class({
  initialize: function (slice) {
    this.s = slice;
  },
  seconds: function () {
    return this.s;
  },
  hours: function () {
    return Math.floor(this.s / Second.HOUR);
  },
  minutes: function () {
    return Math.floor(this.s / Second.MINUTE);
  },
  days: function () {
    return Math.floor(this.s / Second.DAY);
  },
  weeks: function () {
    return Math.floor(this.s / Second.WEEK);
  },
  hour_of_day: function () {
    return this.hours() % Second.HOUR;
  },
  minute_of_hour: function () {
    return this.minutes() % Second.MINUTE;
  },
  tod: function () {
    var hour   = this.hour_of_day(),
        minute = this.minute_of_hour();
    return [ hour, minute ].join(":");
  },
  toString: function () {
    return '<' + [ 'Second', this.s.toString(), this.tod() ].join(':') + '>';
  }
});
OpenLayers.Util.extend(Second, {
  MINUTE : 60,
  HOUR   : 60 * 60,
  DAY    : 60 * 60 * 24,
  WEEK   : 60 * 60 * 24 * 7,
  DAYS   : [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
             'Saturday' ],
  Hours  : function (hours) {
    return new Second(hours * Second.HOUR);
  },
  Days   : function (days) {
    return new Second(days * Second.DAY);
  },
  Minutes: function (days) {
    return new Second(minutes * Second.DAY);
  },
  TOD    : function (hours, minutes, seconds) {
    var s = 0;
    if (hours)
      s += hours * Second.HOUR;
    if (minutes)
      s += minutes * Second.MINUTE;
    if (seconds)
      s += seconds;
    return new Second(s);
  }
});

