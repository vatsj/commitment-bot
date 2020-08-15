module.exports = class ScheduledEvent {

  constructor (schedule, schedule_info) {

    this.schedule = schedule;

    // binds
    // idk if this works with subclasses overwriting methods?
    this.event = this.event.bind(this);

    this.extract_schedule_info(schedule_info);

    this.schedule_event();

  }

  extract_schedule_info(schedule_info) {

    this.schedule_info = schedule_info;

    this.name = schedule_info['name'];

    // handles time/cron conversion and scheduling
    // priority order: time, cron
    let crons = [];

    if ("time" in this.schedule_info) {

      this.time = this.schedule_info["time"];
      crons.push(this.time2cron(this.time));

      // deletes time from schedule_info
      delete this.schedule_info["time"];
    }

    if ("cron" in this.schedule_info) {
      crons.push(this.schedule_info["cron"]);
    }

    // sets cron to be first registered cron
    // if no cron, throw error
    if (crons.length == 0) {
      throw("error: no time information given!")
    }
    this.cron = crons[0];
    this.schedule_info['cron'] = this.cron;
  }

  time2cron(time) {

    // extract number and unit from time
    time = time.split(' ');
    let num = time[0];
    let unit = time[1];

    // cleaning up unit formatting
    unit = unit.toLowerCase;
    if (unit[unit.length - 1] == 's') {
      unit = unit.substring(0, unit.length - 2);
    }

    this.speaker.shout(num + ", " + unit);

    // converts the time to cron format
    this.cron_elts = {
      "second": '*',
      "minute": '*',
      "hour": '*',
      "day": '*',
      "week": '*',
      "year": '*'
    }

    if (unit in this.cron_elts) {
      this.cron_elts[unit] = "*/" + num;
    } else {
      this.speaker.shout("error: time unit not recognized")
    }

    // processing cron value from JSON
    let cron = "" +
    this.cron_elts['second'] + " " +
    this.cron_elts['minute'] + " " +
    this.cron_elts['hour'] + " " +
    this.cron_elts['day'] + " " +
    this.cron_elts['week'] + " " +
    this.cron_elts['year'] + " " +
    "";

    return cron;
  }

  extract_edit(edit_info) {

    let schedule_info = this.schedule_info;

    // overwriting object info with edit info
    for (let key in schedule_info) {
      if (key in edit_info) {
        schedule_info[key] = edit_info[key];
      }
    }

    this.extract_schedule_info(schedule_info);
    this.reschedule_event();
  }

  // add time2cron method!

  delete() {

    this.unschedule_event();
    // call finalize (destructor) method?
  }

  schedule_event() {
    this.job = this.schedule.scheduleJob(this.cron, this.event);
  }

  unschedule_event() {
    this.job.cancel();
  }

  reschedule_event() {
    this.unschedule_event();
    this.schedule_event();
  }

  event() {
    // the thing the schedule calls
    // to be filled in based on the class
  }

  getInfo() {

    let content = "";

    let misc_info = {
      'schedule': this.schedule,
      'etc': ''
    }
    content += JSON.stringify(misc_info, null, 2);

    content += "\n" + JSON.stringify(this.schedule_info, null, 2);

    return content;
  }

  // called by UI-side commitment rendering methods
  getInfo_pretty() {
    return this.name;
  }

}
