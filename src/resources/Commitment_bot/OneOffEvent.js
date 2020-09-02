let cmt_resources = ".";
var ScheduledEvent = require(cmt_resources + "/ScheduledEvent.js");

module.exports = class OneOffEvent extends ScheduledEvent {

  constructor (callback, milliseconds) {
    super(callback);

    this.schedule_event(milliseconds);

  }

  // this.status is intended as an aliasing trick, might not work
  schedule_event(milliseconds) {
    let status = {'cancelled': false};
    this.status = status;

    let job = setTimeout(() => {
      if (! status.cancelled) {
        this.emit('scheduled_evt');

        // deletes event after firing once
        this.emit('delete');
      }
    }, milliseconds);
    return job
  }

  unschedule_event() {
    this.status.cancelled = true;
  }

  reschedule_event(milliseconds) {
    this.unschedule_event();
    this.schedule_event(milliseconds);
  }

  // rewrite this method!
  static time2ms(time) {

    // extract number and unit from time
    time = time.split(' ');
    let num = time[0];
    let unit = time[1];

    // cleaning up unit formatting
    unit = unit.toLowerCase();
    if (unit[unit.length - 1] == 's') {
      unit = unit.substring(0, unit.length - 1);
    }

    // number of list[n + 1]'s in a list[n]'
    const TIME_MULTIPLIERS = {
      "year": 365,
      "week": 7,
      "day": 24,
      "hour": 60,
      "minute": 60,
      "second": 1000
    };

    if (! unit in TIME_MULTIPLIERS) {
      throw("error: time unit not recognized");
    }

    // counts number of time units, as units shrink
    let timeUnits = 0;
    for (let currUnit in TIME_MULTIPLIERS) {
      if (unit == currUnit) {
        timeUnits += num;
      }

      let multiplier = TIME_MULTIPLIERS[unit];
      timeUnits *= multiplier;
    }

    // units are now milliseconds --> return
    return timeUnits;
  }

}
