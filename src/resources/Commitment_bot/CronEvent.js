let cmt_resources = ".";
var ScheduledEvent = require(cmt_resources + "/ScheduledEvent.js");

module.exports = class CronEvent extends ScheduledEvent {

  // adding speaker arg for test logging
  constructor (callback, cron) {
    super(callback);

    // this.cron = cron;
    this.schedule_event(cron);

  }

  // delete() {
  //
  //   this.unschedule_event();
  //   // call finalize (destructor) method?
  // }

  schedule_event(cron) {
    this.job = CronEvent.schedule.scheduleJob(cron, () => {
      this.emit('scheduled_evt');
    });
  }

  unschedule_event(job = this.job) {
    this.job.cancel();
  }

  reschedule_event(cron) {
    this.unschedule_event();
    this.schedule_event(cron);
  }

  getInfo() {

    let content = "";

    let misc_info = {
      'schedule': this.schedule,
      'etc': ''
    }

    content += "\n" + JSON.stringify(this.schedule_info, null, 2);
    content += JSON.stringify(misc_info, null, 2);

    return content;
  }

  static setSchedule(schedule) {
    CronEvent.schedule = schedule;
  }

  static time2cron(time) {

    // extract number and unit from time
    time = time.split(' ');
    let num = time[0];
    let unit = time[1];

    // cleaning up unit formatting
    unit = unit.toLowerCase();
    if (unit[unit.length - 1] == 's') {
      unit = unit.substring(0, unit.length - 1);
    }

    // this.speaker.shout("num: "+num+", unit: "+unit);

    // converts the time to cron format

    // this.cron_elts = {
    //   "second": '*',
    //   "minute": '*',
    //   "hour": '*',
    //   "day": '*',
    //   "week": '*',
    //   "year": '*'
    // }

    this.cron_elts = [
      "year",
      "week",
      "day",
      "hour",
      "minute",
      "second"
    ];

    let cron_JSON = {};
    let cron_elt = null;
    let timeSet = false;
    for (let i = 0; i < this.cron_elts.length; i++) {

      let currUnit = this.cron_elts[i];

      if (unit == currUnit) {
        cron_elt = "*/" + num;
        timeSet = true;
      } else if (timeSet) {
        cron_elt = "0";
      } else {
        cron_elt = "*";
      }

      // cron_builder.push(cron_elt);
      cron_JSON[currUnit] = cron_elt;
    }

    // this.speaker.shout(JSON.stringify(cron_JSON, null, 2));

    if (! timeSet) {
      throw("error: time unit not recognized");
    }

    // if (unit in this.cron_elts) {
    //   this.cron_elts[unit] = "*/" + num;
    // } else {
    //   this.speaker.shout("error: time unit not recognized")
    // }
    //
    // processing cron value from JSON
    let cron = "" +
    cron_JSON['second'] + " " +
    cron_JSON['minute'] + " " +
    cron_JSON['hour'] + " " +
    cron_JSON['day'] + " " +
    cron_JSON['week'] + " " +
    cron_JSON['year'];

    // this.speaker.shout("cron: "+cron);
    return cron;
  }

}
