module.exports = class ScheduledEvent {

  // adding speaker arg for test logging
  constructor (schedule, schedule_info, speaker = null) {

    // pulling a global var
    this.speaker = speaker;

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
    this.description = schedule_info['description'];

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
    unit = unit.toLowerCase();
    if (unit[unit.length - 1] == 's') {
      unit = unit.substring(0, unit.length - 1);
    }

    this.speaker.shout("num: "+num+", unit: "+unit);

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

    content += "\n" + JSON.stringify(this.schedule_info, null, 2);
    content += JSON.stringify(misc_info, null, 2);

    return content;
  }

}
